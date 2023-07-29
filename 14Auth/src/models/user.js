const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
/** 사용자의 스키마( 청사진 ) 정의 */
const userSchema = new Schema( {
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    cart : {
        /** Nested 데이터 구조일 경우에는 아래처럼 선언한다 */
        items : [
            {
                productId : {
                    /** ObjectId 타입으로 정의 */
                    type : Schema.Types.ObjectId,
                    /**
                     * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
                     *
                     * --> 참조할 model 의 이름을 사용하면 된다
                     */
                    ref : 'Product',
                    required : true,
                },
                quantity : {
                    type : Number,
                    required : true,
                }
            }
        ]
    }
} );

/**
 * - 장바구니 추가 메서드
 *
 * - 해당 Schema 에 메서드를 추가할때는 .methods 에 해당 메서드를 추가하면 된다
 *
 * --> 이때 내부 this 가 model 객체를 참조할 수 있도록 function 키워드를 사용해야 한다
 */
userSchema.methods.addToCart = function ( product ){
    const cartProductIndex = this.cart.items.findIndex( cp => {
        /** toString 메서드로 ObjectId 의 문자열만 추출하여 사용할 수 있다 */
        return cp.productId.toString() === product._id.toString();
    } );
    let newQuantity = 1;
    const updatedCartItems = [ ...this.cart.items ];

    if ( 0 <= cartProductIndex ){
        newQuantity = this.cart.items[ cartProductIndex ].quantity + 1;
        updatedCartItems[ cartProductIndex ].quantity = newQuantity;
    }
    else {
        updatedCartItems.push( {
            productId : product._id ,
            quantity : newQuantity
        } )
    }
    this.cart = { items : updatedCartItems };

    /** 자기자신의 save 메서드를 호출하여 업데이트 */
    return this.save();
}

/**
 * - cart 에서 해당 제품들 제거
 */
userSchema.methods.removeFromCart = function( productId ){
    /** 해당 item 필터링 */
    this.cart.items = this.cart.items.filter( item => {
        return item.productId.toString() !== productId.toString();
    } );

    /** 자기자신의 save 메서드를 호출하여 업데이트 */
    return this.save();
}

/**
 * - 해당 장바구니 객체 비우기
 */
userSchema.methods.clearCart = function(){
    this.cart = { items : [] };
    /** 자기자신의 save 메서드를 호출하여 업데이트 */
    return this.save();
}

module.exports = mongoose.model( 'User' , userSchema );