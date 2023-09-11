/**
 * - 매장관리자의 제품생성 처리 관련 라우팅 파일
 *
 * --> 실제 페이지 패스의 접근경로
 */
const express = require( 'express' );

const adminController = require( '../controllers/admin' );
const isAuth = require( '../middleware/is-auth' );
const { body } = require( 'express-validator' );

const router = express.Router();

// /admin/add-product => GET
router.get( '/add-product' , isAuth , adminController.getAddProduct );

// /admin/products => GET
router.get( '/products' , isAuth , adminController.getProducts );

// /admin/add-product => POST
router.post( '/add-product' ,
    [
        body( 'title' )
            .isString()
            .isLength( { min : 3 } )
            .trim(),
        body( 'price' )
            /** 소숫점이하를 가지고 있는지 체크하는 validator */
            .isFloat(),
        body( 'description' )
            .isLength( { min : 5 , max : 400 } )
    ],
    isAuth ,
    adminController.postAddProduct
);

router.get( '/edit-product/:productId' , isAuth , adminController.getEditProduct );

router.post( '/edit-product' ,
    [
        body( 'title' )
            .isString()
            .isLength( { min : 3 } )
            .trim(),
        body( 'price' )
            /** 소숫점이하를 가지고 있는지 체크하는 validator */
            .isFloat(),
        body( 'description' )
            .isLength( { min : 5 , max : 400 } )
    ],
    isAuth ,
    adminController.postEditProduct
);

router.delete( '/product/:productId' , isAuth , adminController.deleteProduct );

module.exports = router;