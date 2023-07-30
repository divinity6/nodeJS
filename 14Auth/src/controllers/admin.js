const Product = require( "../models/product" );

/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {

    Product.find()
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

    const product = new Product( {
        title ,
        price ,
        description ,
        imageUrl ,
        /** Mongoose 에서는 user 전체를 넣어도 user._id 를 찾아서 할당해준다... */
        userId : req.user
    } );

    /** mongoose 에서 save 메서드를 제공해준다 */
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
        return res.redirect( '/' );
    }
    const prodId = req.params.productId;

    /**
     * - id 가 prodId 인 Product 반환
     *
     * --> 파라미터로 string 을 전달하면 Mongoose 에서 ObjectId 로 변환해준다
     */
    Product.findById( prodId )
        .then( ( product ) => {
            if ( !product ){
                return res.redirect( '/' );
            }

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
    const { title , price , imageUrl , description } = req.body;
    const prodId = req.body.productId;

    Product
        .findById( prodId )
        /**
         * - product 가 mongoose 객체이기 때문에,
         *   해당 model 객체의 프로퍼티를 수정해주고,
         *   저장해주면 업데이트가 된다
         */
        .then( product => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;

            return product.save();
        } )
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

    Product.findByIdAndRemove( prodId )
        .then( result => {
            console.log( '<<destroyProduct>> :' , result );
            res.redirect( "/admin/products" );
        } )
        .catch( err => console.log( '<<findDataFetchErr>> :' , err ) );
}