const fs = require( 'fs' );
const path = require( 'path' );
const { validationResult } = require( 'express-validator' );

const Post = require( '../models/post' );
/**
 * - 게시물 목록을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = ( req , res , next ) => {

    Post.find()
        .then( posts => {
           res.status( 200 ).json( {
               message : 'Fetched posts successfully.',
               posts
           } );
        } )
        .catch( err => {
            if ( !err.statusCode ){
                err.statusCode = 500;
            }
            next( err );
        } );
};

/**
 * - 게시물을 생성하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.createPost = ( req , res , next ) => {
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
        creator : {
            name : 'Maximilian'
        },
    } );
    /** 해당 게시물을 DB 에 저장 */
    post.save()
        .then( result => {

            /**
             * 상태코드 201 은 게시물을 생성했다는 알림을 명시적으로 보내는 것이다
             * ( 반면 200 은 단지 성공했다는 알림만 보낸다 )
             */
            res.status( 201 ).json( {
                message : 'Post created successfully!',
                post : result
            } );
        } )
        .catch( err => {
            if ( !err.statusCode ){
                err.statusCode = 500;
            }
            next( err );
        } );
}

/**
 * - 단일 게시물 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getPost = ( req , res , next ) => {
    const postId = req.params.postId;

    Post.findById( postId )
        .then( post => {
            if ( !post ){
                const error = new Error( 'Could not find post.' );
                error.statusCode = 404;
                throw error;
            }
            res.status( 200 ).json( { message : 'Post fetched.' , post } );
        } )
        .catch( err => {
            if ( !err.statusCode ){
                err.statusCode = 500;
            }
            next( err );
        } );
}

/**
 * - 단일 게시물 업데이트 Controller
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = ( req , res , next ) => {
    const errors = validationResult( req );

    /** 유효성 검사 실패 코드 */
    if ( !errors.isEmpty() ){
        const error = new Error( 'Validation failed. entered data is incorrect.' );
        error.statusCode = 422;
        throw error;
    }

    const postId = req.params.postId;
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

    /** 에러가 없을 경우에는 DB 에 업데이트 */
    Post.findById( postId )
        .then( post => {
            if ( !post ){
                const error = new Error( 'Could not find post.' );
                error.statusCode = 404;
                throw error;
            }

            /** imageUrl 이 업데이트 되었다면, 이전 Image 를 제거 */
            if ( imageUrl !== post.imageUrl ){
                clearImage( post.imageUrl );
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.conent = content;
            return post.save();
        } )
        .then( result => {
            res.status( 200 ).json( { message : 'Post updated!.' , post : result } );
        } )
        .catch( err => {
            if ( !err.statusCode ){
                err.statusCode = 500;
            }
            next( err );
        } );
}

/**
 * - 단일 게시물 삭제 Controller
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = ( req , res , next ) => {
    const postId = req.params.postId;
    /** 해당 게시물이 존재하는지 체크 */
    Post.findById( postId )
        .then( post => {
            if ( !post ){
                const error = new Error( 'Could not find post.' );
                error.statusCode = 404;
                throw error;
            }

            // Check logged in user
            clearImage( post.imageUrl );

            /** 존재할 경우 DB 에서 제거 */
            return Post.findByIdAndRemove( postId );
        } )
        .then( result => {
            console.log( '<< Delete Post >>' , result );
            res.status( 200 ).json( { message : 'Deleted post.' } );
        } )
        .catch( err => {
        if ( !err.statusCode ){
            err.statusCode = 500;
        }
        next( err );
    } );
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