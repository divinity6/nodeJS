const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const userSchema = new Schema( {
    email : {
        type : String,
        require : true,
    },
    password : {
        type : String,
        require : true
    },
    name : {
        type : String,
        require : true,
    },
    status : {
        type : String,
        require : true,
    },
    posts : [
        {
            /** ObjectId 타입으로 정의 */
            type : Schema.Types.ObjectId,
            /**
             * 해당 데이터가 어떤 Collection 의 데이터인지 관계를 설정( reference )할 수 있다
             *
             * --> 참조할 model 의 이름을 사용하면 된다
             */
            ref : 'Post'
        }
    ]
} );

module.exports = mongoose.model( 'User' , userSchema );