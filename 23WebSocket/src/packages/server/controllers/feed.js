const fs = require( 'fs' );
const path = require( 'path' );
const { validationResult } = require( 'express-validator' );

const io = require( '../socket' );
const Post = require( '../models/post' );
const User = require( '../models/user' );

/**
 * - 게시물 목록을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = async ( req , res , next ) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    try {
        /** 전체 Post 를 가지고 온후, 전체 갯수를 반환함 */
        const totalItems = await Post.find().countDocuments();

        /** 모든 Posts 를 찾아 반환 */
        const posts = await Post.find()
            /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
            .populate('creator')
            /** 데이터를 내림차순 정렬 - 최근에 작성된 순으로 정렬하여 반환 */
            .sort( { createdAt : -1 } )
            /**
             * - skip 메서드를 추가하면,
             *   find 로 찾은 결과중 첫 번째부터 skip 갯수만큼 생략한다
             */
            .skip( ( currentPage - 1 ) * perPage )
            /**
             * - limit 메서드는 find 로 가져오는 데이터양을 지정할 수 있다
             */
            .limit( perPage )

        res.status( 200 ).json( {
            message : 'Fetched posts successfully.',
            posts ,
            totalItems
        } );
    }
    catch ( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
};

/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = async ( req , res , next ) => {
    const errors = validationResult( req );

    /** 유효성 검사 실패 코드 */
    if ( !errors.isEmpty() ){
        const error = new Error( 'Validation failed. entered data is incorrect.' );
        error.statusCode = 422;
        throw error;
    }
    /** 파일이 없을 경우 처리 */
    if ( !req.file ){
        const error = new Error( 'No image provided.' );
        error.statusCode = 422;
        throw error;
    }

    const fullPath = req.file.path.split( '/' );
    const imageUrl = `${ fullPath[ fullPath.length - 2 ] }/${ fullPath[ fullPath.length - 1 ] }`;
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post( {
        title ,
        content,
        imageUrl,
        creator : req.userId,
    } );
    try {
        /** 해당 게시물을 DB 에 저장 */
        await post.save();

        /** 여기에서 찾은 User 는 현재 로그인 중인 사용자다 */
        const user = await User.findById( req.userId );

        /** 해당 사용자의 posts 목록도 업데이트 해준다 */
        user.posts.push( post );

        await user.save();

        /**
         * - webSocket 에 연결된 모든 사용자에게 메시지를 발신한다
         *
         * @param { string } posts - 이벤트 이름
         * @param { any } data - 전달할 데이터
         */
        io.getIO().emit( 'posts' , {
            action : 'create',
            post : {
                ...post._doc,
                creator : { _id : req.userId , name : user.name } }
        } );

        /**
         * 상태코드 201 은 게시물을 생성했다는 알림을 명시적으로 보내는 것이다
         * ( 반면 200 은 단지 성공했다는 알림만 보낸다 )
         */
        res.status( 201 ).json( {
            message : 'Post created successfully!',
            post,
            creator : {
                _id : user._id,
                name : user.name
            }
        } );
    }
    catch( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
}

/**
 * - 단일 게시물 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getPost = async ( req , res , next ) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById( postId );

        if ( !post ){
            const error = new Error( 'Could not find post.' );
            error.statusCode = 404;
            throw error;
        }
        res.status( 200 ).json( { message : 'Post fetched.' , post } );
    }
    catch( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
}

/**
 * - 단일 게시물 업데이트 Controller
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = async ( req , res , next ) => {
    const postId = req.params.postId;
    const errors = validationResult( req );

    /** 유효성 검사 실패 코드 */
    if ( !errors.isEmpty() ){
        const error = new Error( 'Validation failed. entered data is incorrect.' );
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    /**
     * - image 를 새로추가했을 경우에는, 새로 추가하고,
     *   그렇지 않을 경우에는 기존 imageUrl 을 사용한다
     */
    let imageUrl = req.body.image;
    if ( req.file ){
        const fullPath = req.file.path.split( '/' );
        imageUrl = `${ fullPath[ fullPath.length - 2 ] }/${ fullPath[ fullPath.length - 1 ] }`;
    }

    /** imageUrl 자체가 존재하지 않을경우에는 에러 처리 */
    if ( !imageUrl ){
        const error = new Error( 'No file picked.' );
        error.statusCode = 422;
        throw error;
    }

    try {
        /** 에러가 없을 경우에는 DB 에 업데이트 */
        const post = await Post.findById( postId ).populate( 'creator' );

        if ( !post ){
            const error = new Error( 'Could not find post.' );
            error.statusCode = 404;
            throw error;
        }

        /** 해당 Post 의 생성자가 현재 User 와 같은지 체크( 자기자신이 만든 게시물인지 체크 ) */
        if ( post.creator._id.toString() !== req.userId ){
            const error = new Error( 'Not authorized!' );
            error.statusCode = 403;
            throw error;
        }

        /** imageUrl 이 업데이트 되었다면, 이전 Image 를 제거 */
        if ( imageUrl !== post.imageUrl ){
            clearImage( post.imageUrl );
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.conent = content;

        const result = await post.save();

        /** 모든 저장로직을 마치고 데이터를 반환할때 websocket 메시지로 반환한다 */
        /**
         * - webSocket 에 연결된 모든 사용자에게 메시지를 발신한다
         *
         * @param { string } posts - 이벤트 이름
         * @param { any } data - 전달할 데이터
         */
        io.getIO().emit( 'posts' , { action : 'update', post : result } );

        res.status( 200 ).json( { message : 'Post updated!.' , post : result } );
    }
    catch( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
}

/**
 * - 단일 게시물 삭제 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = async ( req , res , next ) => {
    const postId = req.params.postId;

    try {
        /** 해당 게시물이 존재하는지 체크 */
        const post = await Post.findById( postId );

        if ( !post ){
            const error = new Error( 'Could not find post.' );
            error.statusCode = 404;
            throw error;
        }

        /** 해당 Post 의 생성자가 현재 User 와 같은지 체크( 자기자신이 만든 게시물인지 체크 ) */
        if ( post.creator.toString() !== req.userId ){
            const error = new Error( 'Not authorized!' );
            error.statusCode = 403;
            throw error;
        }

        // Check logged in user
        clearImage( post.imageUrl );

        /** 존재할 경우 DB 에서 제거 */
        await Post.findByIdAndRemove( postId );

        /** 사용자 테이블에서도 삭제 */
        const user = await User.findById( req.userId );

        /**
         * - Mongoose 에서 제공하는 pull 메서드를 사용하면,
         *   삭제하려는 게시물의 ID 를 전달하면 리스트에서 삭제해준다
         * */
        user.posts.pull( postId );
        await user.save();

        /** 모든 저장로직을 마치고 데이터를 반환할때 websocket 메시지로 반환한다 */
        /**
         * - webSocket 에 연결된 모든 사용자에게 메시지를 발신한다
         *
         * @param { string } posts - 이벤트 이름
         * @param { any } data - 전달할 데이터
         */
        io.getIO().emit( 'posts' , {
            action : 'delete',
            post : postId,
        } )

        res.status( 200 ).json( { message : 'Deleted post.' } );
    }
    catch( err ){
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    }
}

/**
 * - Image 삭제 헬퍼함수
 *
 * @param filePath
 */
const clearImage = filePath => {
    /** 현재 path 에서 한단계 상위로 올라가서 */
    filePath = path.join( __dirname , '..' , filePath );
    /** 파일을 삭제하고, 오류 로그를 남긴다 */
    fs.unlink( filePath , err => {
        console.log( '<< image delete error >>' , err );
    } )
};