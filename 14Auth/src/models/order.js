const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
/** 주문의 스키마( 청사진 ) 정의 */
const orderSchema = new Schema( {
    products : [
        {
            /** 애는 싱크를 맞추지는 않는구만... - 굳이 세세하게 설정하지 않고 모든 값을 받아버리네 */
            product : {
                type : Object,
                required : true
            },
            quantity : {
                type: Number,
                required : true
            }
        }
    ],
    user : {
        name : {
            type : String,
            required : true,
        },
        userId : {
            type : Schema.Types.ObjectId,
            /**
             * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
             *
             * --> 참조할 model 의 이름을 사용하면 된다
             */
            ref : 'User',
            required : true,
        }
    }
} );
module.exports = mongoose.model( 'Order' , orderSchema );