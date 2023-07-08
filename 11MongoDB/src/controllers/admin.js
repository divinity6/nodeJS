const Product = require( "../models/product" );

/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    // Product.findAll()
    Product.fetchAll()
        .then( products => {
            res.render( 'admin/products' , {
                prods : products ,
                pageTitle : 'Admin Products' ,
                path : '/admin/products' ,
            } );
        } )
        .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
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

    const product = new Product( title , price , description , imageUrl );

    product.save()
        .then( result => {
            console.log( '<<Created Product by Database>> :' , result );
            res.redirect( '/admin/products' );
        } )
        .catch( err => {
            console.log( '<<AddDataFetchErr>> :' , err )
        } );

}

/**
 * - 제품 수정 페이지 반환 Controller
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

    /**
     * - id 가 prodId 인 Product 반환
     */
    Product.findById( prodId )
        .then( ( product ) => {
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

        } )
        .catch( err => console.log( '<<findDataFetchErr>> :' , err ) )

}

/**
 * - 제품 수정  Controller
 * @param req
 * @param res
 * @param next
 */
exports.postEditProduct = ( req , res , next ) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = new Product(
        updatedTitle ,
        updatedPrice ,
        updatedDesc ,
        updatedImageUrl ,
        prodId
    );

    product.save()
        .then( result => {
            console.log( '<<updatedData>> :' , result );
            res.redirect( "/admin/products" );
        } )
        .catch( err =>  console.log( '<<findDataFetchErr>> :' , err ) );


}

/**
 * - 제품 제거 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postDeleteProduct = (  req , res , next ) => {
    const prodId = req.body.productId;

    console.log( 'prodId' , prodId );

    Product.deleteById( prodId )
        .then( result => {
            console.log( '<<destroyProduct>> :' , result );
            res.redirect( "/admin/products" );
        } )
        .catch( err => console.log( '<<findDataFetchErr>> :' , err ) );
}