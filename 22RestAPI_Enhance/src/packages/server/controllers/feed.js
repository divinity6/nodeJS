const { validationResult } = require( 'express-validator' );
/**
 * - 게시물들을 반환하는 controller
 * @param req
 * @param res
 * @param next
 */
exports.getPosts = ( req , res , next ) => {
    /**
     * - expressJS 에서 제공하는 json 메서드
     *
     * --> json 메서드를 이용하면 응답헤더에 자동으로 application/json 를 할당해준다
     * */
    res.status( 200 ).json( {
        posts : [
            {
                _id : '1',
                title : 'First Post' ,
                content : 'This is the first post' ,
                imageUrl : 'images/hodu.png',
                creator : {
                    name : 'Maximilian'
                },
                createdAt : new Date()
            }
        ]
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
        return res.status( 402 ).json( {
            message : 'Validation failed. entered data is incorrect.',
            errors : errors.array()
        } );
    }

    const title = req.body.title;
    const content = req.body.content;
    /**
     * 상태코드 201 은 게시물을 생성했다는 알림을 명시적으로 보내는 것이다
     * ( 반면 200 은 단지 성공했다는 알림만 보낸다 )
     */
    // Create post in db
    res.status( 201 ).json( {
        message : 'Post created successfully!',
        post : {
            _id : new Date().toISOString(),
            title ,
            content,
            imageUrl : 'images/hodu.png',
            creator : {
                name : 'Maximilian'
            },
            createdAt : new Date()
        }
    } );
}

