const Product = require( "../models/product" );

/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    Product.fetchAll()
        .then( ( [ rows , fieldData ] ) => {
            res.render( 'admin/products' , {
                prods : rows ,
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

    /**
     * - 해당 데이터를 자동으로 database 에 저장한다
     *
     * --> Sequelize 는 db 에 저장시 비동기로 처리한다
     */
    Product.create( {
        title,
        imageUrl,
        description,
        price
    } )
        .then( result => {
            console.log( '<<Created Product by Database>> :' , result )
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

    const updatedProduct = new Product(
        prodId ,
        updatedTitle ,
        updatedImageUrl ,
        updatedDesc ,
        updatedPrice
    );

    console.log( "updatedProduct" , updatedProduct );
    updatedProduct.save();

    res.redirect( "/admin/products" );
}

/**
 * - 제품 제거 Controller
 * @param req
 * @param res
 * @param next
 */
exports.postDeleteProduct = (  req , res , next ) => {
    const prodId = req.body.productId;

    Product.deleteById( prodId , () => {
    } );

    res.redirect( "/admin/products" );
}