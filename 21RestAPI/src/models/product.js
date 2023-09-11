const mongoose = require( 'mongoose' );
/** mongoose Schema constructor */
const Schema = mongoose.Schema;
/** 제품의 스키마( 청사진 ) 정의 */
const productSchema = new Schema( {
    title : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    imageUrl : {
        type : String,
        required : true,
    },
    userId : {
        /** ObjectId 타입으로 정의 */
        type : Schema.Types.ObjectId,
        /**
         * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
         *
         * --> 참조할 model 의 이름을 사용하면 된다
         */
        ref : 'User',
        required : true,
    }
} );

/**
 * - mongoose Schema 를 Product 모델에 설정하고 내보냄
 *
 * --> 이렇게 설정하면 Mongoose 가 소문자 및 복수형 이름으로
 *     데이터베이스 collection 을 만들어 사용한다
 */
module.exports = mongoose.model( 'Product' , productSchema );