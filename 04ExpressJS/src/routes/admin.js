/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 */
const express = require( 'express' );

const router = express.Router();

/**
 * - add-product 요청을 위에 작성하는 이유는,
 *   요청이 파일 위에서부터 아래로 내려가고,
 *
 * - next() 를 호출하지 않으면, 다음 미들웨어로 넘어가지 않기 때문이다
 *
 * - 즉 add-product 경로를 만나면, 다음 use 를 실행하지 않는다!
 */
router.get( '/add-product' , ( req , res , next )=> {
    res.send( '' +
        '<form action="/product" method="POST">' +
        '<input type="text" name="title" />' +
        '<button type="submit">Add Product</button>' +
        '</form>' );
} );

/**
 * - 라우팅 경로가 다르기때문에 / 앞이면, 어디에 둬도 충돌하지 않는다
 *
 * - post 요청에만 반응한다
 */
router.post( '/product' , ( req , res , next ) => {
    console.log( 'req.body' ,  req.body );
    res.redirect( '/' );
} );

module.exports = router;