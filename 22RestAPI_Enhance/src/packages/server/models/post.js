const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

/**
 * - Schema 의 2 번째 인수로 Option 을 설정할 수 있다
 */
const postSchema = new Schema( {
    title : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    creator : {
        type : Object,
        required : String,
    }
} , { timestamps : true } );

/** 해당 Schema( 청사진 )에 기반한 model export */
module.exports = mongoose.model( 'Post' , postSchema );