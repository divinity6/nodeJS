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
    const path = req.file.path.split( '/' );

    const imageUrl = `${ path[ path.length - 2 ] }/${ path[ path.length - 1 ] }`;
    console.log( '<< imageUrl >>' , imageUrl );
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
            console.log( '<< createPost result >>' , result );

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