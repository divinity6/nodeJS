const bcrypt = require( 'bcryptjs' );
const validator = require( 'validator' );
const jwt = require( 'jsonwebtoken' );
const User = require( '../models/user' );
const Post = require( '../models/post' );

/** 들어오는 Query 를 위해 실행되는 논리 정의 */
module.exports = {
    /**
     * - Schema 에 정의했던 arguments 데이터들이 첫 번째 argument 에 들어온다
     *   ( 다수의 arguments 들을 입력할 수 있기 때문에, 첫번째 파라미터에 객체형태로 들어온다 )
     * */
    createUser : async ( { userInput } , req ) => {
        const existingUser = await User.findOne( { email : userInput.email } );

        const errors = [];
        /** email 체크 */
        if ( !validator.isEmail( userInput.email ) ){
           errors.push( { message : 'E-Mail is invalid.' } );
        }

        /** password 체크 */
        if (
            validator.isEmpty( userInput.password ) ||
            !validator.isLength( userInput.password , { min : 5 } )
        ){
            errors.push( { message : 'Password too short!' } );
        }

        if ( 0 < errors.length ){
            const error = new Error( 'Invalid input.' );
            /** 에러 객체의 data 필드에 발생한 error 들 추가 */
            error.data = errors;
            error.code = 422;

            throw error;
        }

        /** 사용자가 존재할 경우 에러 생성 */
        if ( existingUser ){
            const error = new Error( 'User exists already!' );
            throw error;
        }

        /** password 를 암호화하고 저장한 후, 응답 값 반환 */
        const hashedPw = await bcrypt.hash( userInput.password , 12 );
        const user = new User( {
            email : userInput.email,
            name : userInput.name,
            password : hashedPw
        } );

        /** DB 에 사용자 저장 */
        const createdUser = await user.save();

        /**
         * - Schema 에 정의된 User 객체와 같은 type 을 반환하도록 한다
         *
         * - _doc 를 사용하면, Mongoose 가 추가한 메타데이터를 제외한 사용자가 입력한 데이터들만 반환한다
         */
        return {
            ...createdUser._doc,
            _id : createdUser._id.toString(),
        }
    },
    /** 로그인 resolver  */
    login : async ( { email , password } ) => {
        const user = await User.findOne( { email } );

        /** 유효한 사용자가 없을 경우 */
        if ( !user ){
            const error = new Error( 'User not found.' );
            error.code = 401;
            throw error;
        }

        /** 사용자의 password 와 DB password 를 검사한다 */
        const isEqual = await bcrypt.compare( password, user.password );
        if ( !isEqual ){
            const error = new Error( 'Password is incorrect.' );
            error.code = 401;
            throw error;
        }

        /**
         * - sign 메서드를 이용해 새로운 서명( 시그니처 )생성
         *
         * @param { any } payload - 토큰에 이메일, 사용자 아이디등등
         *   ( 그러나, 비밀번호를 포함하는것은 보안상 좋지 않다 )
         *
         * @param { string } secretOrPrivateKey - 서명에 사용할 private key 를 사용한다
         *                                        ( 이 값을 이용해 난수화해서 해독할 수 없게한다 )
         *
         * @param { any } options - 유효기간등 옵션을 설정할 수 있다
         *                          ( expiresIn : '1h' => 1시간 유효 )
         */
        const token = jwt.sign( {
            userId : user._id.toString(),
            email : user.email
        } , 'somesupersecretsecret' , { expiresIn : '1h' } );
        return { token , userId : user._id.toString() }
    },
    /** 게시물 전부 가져오기 */
    posts : async ( args , req ) => {

        /** 검증되지 않은 사용자일 경우 처리 */
        if ( !req.isAuth ){
            const error = new Error( 'Not authenticated!' );
            error.code = 401;
            throw error;
        }

        /** 전체 Post 를 가지고 온후, 전체 갯수를 반환함 */
        const totalPosts = await Post.find().countDocuments();

        const posts = await Post.find()
            /** sort : 데이터를 내림차순 정렬 - 최근에 작성된 순으로 정렬하여 반환 */
            .sort( { createdAt : -1 } )
            /** 참조 중인 User 테이블에서 creator 필드를 채워서 반환 */
            .populate( 'creator' );
        return {
            posts : posts.map( p => ( {
                ...p._doc ,
                _id : p._id.toString(),
                /**
                 * - 작성일시등은 Date 타입으로 저장되는데 GraphQL 은 읽지 못하기 때문에,
                 *   String 으로 변환해주면 된다
                 */
                createdAt : p.createdAt.toISOString(),
                updatedAt : p.updatedAt.toISOString(),
            } ) ),
            totalPosts,
        };
    },
    /** 게시물 추가하기 */
    createPost : async ( { postInput } , req ) => {
        /** 검증되지 않은 사용자일 경우 처리 */
        if ( !req.isAuth ){
            const error = new Error( 'Not authenticated!' );
            error.code = 401;
            throw error;
        }

        const errors = [];
        /** title validation 체크 */
        if ( validator.isEmpty( postInput.title ) ||
            !validator.isLength( postInput.title , { min : 5 } ) ){
            errors.push( { message : 'Title is invalid.' } );
        }

        /** content validation 체크 */
        if ( validator.isEmpty( postInput.content ) ||
            !validator.isLength( postInput.content , { min : 5 } ) ){
            errors.push( { message : 'Content is invalid.' } );
        }

        if ( 0 < errors.length ){
            const error = new Error( 'Invalid input.' );
            /** 에러 객체의 data 필드에 발생한 error 들 추가 */
            error.data = errors;
            error.code = 422;

            throw error;
        }
        console.log( '<< req.userId >>' , req.userId );
        /** 여기에서 찾은 User 는 현재 로그인 중인 사용자다 */
        const user = await User.findById( req.userId );
        if ( !user ){
            const error = new Error( 'Invalid user.' );
            error.code = 422;
            throw error;
        }

        /** 새로운 게시물 생성 */
        const post = new Post( {
            title : postInput.title,
            content : postInput.content,
            imageUrl : postInput.imageUrl,
            /** creator 필드에 DB 에서 가져온 User 설정 */
            creator : user,
        } );
        const createdPost = await post.save();

        /** 해당 사용자의 posts 목록도 업데이트 해준다 */
        user.posts.push( createdPost );

        /** 사용자 데이터 저장 */
        await user.save();

        return {
            ...createdPost._doc ,
            _id : createdPost._id.toString(),
            /**
             * - 작성일시등은 Date 타입으로 저장되는데 GraphQL 은 읽지 못하기 때문에,
             *   String 으로 변환해주면 된다
             */
            createdAt : createdPost.createdAt.toISOString(),
            updatedAt : createdPost.updatedAt.toISOString(),
        }
    }
};