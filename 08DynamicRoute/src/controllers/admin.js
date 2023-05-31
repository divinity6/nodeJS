const Product = require( "../models/product" );

/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {
    Product.fetchAll( ( products ) => {
        res.render( 'admin/products' , {
            prods : products ,
            pageTitle : 'Admin Products' ,
            path : '/admin/products' ,
        } );
    } );
}

/**
 * - 제품추가 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getAddProduct = ( req , res , next )=> {
    res.render( 'admin/edit-product' , {
        pageTitle : 'Add Product' ,
        path : "/admin/add-product",
        editing : false,
    } )
}

/**
 * - 제품추가 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postAddProduct = ( req , res , next ) => {

    const { title , imageUrl , description , price } = req.body;

    const product = new Product( title , imageUrl , description , price );

    console.log( "Res" , req.body );
    product.save();

    res.redirect( '/' );
}

/**
 * - wpvna vuswlq 페이지 반환 Controller
 * @param req
 * @param res
 * @param next
 */
exports.getEditProduct = ( req , res , next )=> {

    const editMode = req.query.edit;

    if ( !editMode ){
        console.log( "dd" )
        return res.redirect( '/' );
    }
    const prodId = req.params.productId;

    console.log( "req.params" , req.params );

    Product.findById( prodId , product => {

        if ( !product ){
            console.log( "p" )
            return res.redirect( '/' );
        }

        console.log( "product" , product );

        res.render( 'admin/edit-product' , {
            pageTitle : 'Edit Product' ,
            path : "/admin/edit-product",
            editing : editMode,
            product,
        } )
    } );


}