## AuthAdvanced

- 앱의 보안, 인증관련 사항을 전체적인 개선을 목적으로 둔다
  - ( 예 : POST 생성 사용자만 편집할 수 있도록 하는 기능등 )


- 비밀번호 재설정등 권한 부여 절차 사용
  - ( 자신이 생성한 내용만 편집하고, 삭제할 수 있도록 수정 )
   
---

### ResetPassword

- 비밀번호 재설정 기능


- 비밀번호 재설정 링크가 포함된 이메일을 받아 처리하는 것이 일반적인 비밀번호 재설정 기능


- 유효기간이 존재하는 **고유한 토큰을 생성해서 데이터베이스에 저장**해야 한다
  - ( 클릭할 링크에 토큰이 들어있도록 해서, 사용자가 해당 링크를 우리에게 받았는지 체크하는 것 )


- 즉, 비밀번호를 재설정할 수 있는 토큰을 발행( 유효기간이 있는 )하고 


- 해당 토큰값을 가진 사용자를 찾아, 비밀번호 재설정 권한을 주는 것

---

#### Crypto

- nodeJS 에는 내장된 암호 라이브러리가 존재하기 때문에, 이를 사용하면 된다


- NodeJS 내부에 내장된 고유 암호화 라이브러리가 존재한다


- 해당 라이브러리로 토큰을 생성후, DB 에서 일치하는 사용자를 찾는다.


- 일치하는 사용자가 존재할 경우 token 을 등록하고, 비밀번호 재설정 링크가 담긴 이메일을 발송한다


- 해당 재설정 링크에 비밀번호 재설정 토큰값( resetToken )을 저장하여 발송한다

````javascript
const crypto = require( 'crypto' );


/**
 * - 비밀번호 재설정 post controller
 * @param req
 * @param res
 * @param next
 */
exports.postReset = ( req , res , next ) => {
  /**
   * - 32 개의 무작위 바이트 생성
   *
   * - 생성 후 2번째 콜백을 실행하게 된다
   */
  crypto.randomBytes( 32 , ( err , buffer ) => {
    /** error 발생시 다시 리다이렉트 */
    if ( err ){
      console.log( '<< postReset error >>' , err );
      return res.redirect( './reset' );
    }
    /** 16 진법을 이용하여 buffer token 생성 */
    const token = buffer.toString( 'hex' );

    /** 일치하는 Email 로 DB 의 사용자 조회 */
    User.findOne( { email : req.body.email } )
            .then( user => {
              if ( !user ){
                /** error flash 등록 */
                req.flash( 'error' , 'No account with that email found.' );
                return res.redirect( '/reset' );
              }
              /**
               * - 찾은 사용자 데이터에 resetToken 설정
               *   ( 한시간동안 토큰 만료시간 설정 )
               */
              user.resetToken = token;
              user.resetTokenExpiration = Date.now() + 3600000;
              return user.save();
            } )
            .then( result => {
              res.redirect( '/' );
              /** 비밀번호 재설정 이메일 발신 */
              transporter.sendMail( {
                to : req.body.email,
                from : 'divinity666@naver.com',
                subject : 'Password reset',
                html : `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${ token }">link</a> to set a new password.</p>
                    `
              } );
            } )
            .catch( err => {
              console.log( 'err' , err );
            } );
  });
}
````

### Token

- 메일로 발송한 token 값을 이용해, 사용자를 인증.


- token 만료일자기 지나지 않고, token 이 일치하는 사용자를 검색하여,
  - 해당 사용자를 화면에 뿌림

````javascript
/** ===== controller/auth.js ===== */
/**
 * - 비밀번호 실제 재설정 get controller
 * @param req
 * @param res
 * @param next
 */
exports.getNewPassword = ( req , res , next ) => {
    const token = req.params.token;

    /**
     * - token 을 이용해 해당 token 과 일치하고,
     *
     *   token 만료일자가 지나지 않은 사용자를 찾는다
     *
     * @resetTokenExpiration :
     *  - $gt : 보다 크다는 뜻,
     *    즉, 현재시각( Date.now() ) 보다
     *
     *  - 토큰 만료일자가 더 큰 사용자를 찾는다는 뜻
     */
    User.findOne( {
            resetToken : token ,
            resetTokenExpiration : {
                /** $gt 는 보다 크다는 뜻 */
                $gt : Date.now()
            }
        } )
        .then( user => {
            let [ message ] = req.flash('error');
            if ( !message ){
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage : message,
                /** ObjectId 에서 실제 string 으로 변경 */
                userId : user._id.toString()
            });
        } )
        .catch( err => console.log( '<<finUserErr>>' , err ) );
}
````

- route 에서는 DynamicToken 을 이용하여 사용자 설정

````javascript
/** ===== routes/auth.js ===== */
/** DynamicRoute 를 이용하여 라우트 매핑 */
router.get( '/reset/:token' , authController.getNewPassword );

````

- 발행한 토큰 값을 이용해 사용자를 찾아 비밀번호를 업데이트하고, 토큰값을 지움
  - mongoose 에 값을 업데이트할때는 해당 값에 undefined 를 설정하면 그 값은 저장하지 않는구만


````javascript
/** ===== controller/auth.js ===== */
/**
 * - 비밀번호 업데이트 controller
 * @param req
 * @param res
 * @param next
 */
exports.postNewPassword = ( req , res , next ) => {
    const { password , userId , passwordToken } = req.body;
    let resetUser;

    User.findOne( {
        resetToken : passwordToken ,
        resetTokenExpiration : {
            $gt : Date.now()
        },
        _id : userId
    } )
        .then( user => {
            resetUser = user;
            /**
             * - hash 화 하고싶은 문자열을 첫 번째 인자로 넘겨준다
             *
             * - 두 번째는 몇 차례의 해싱을 적용할 것인지 지정한다
             *   ( 솔트 값이 높을수록 오래걸리지만, 더 안전하다 )
             *
             * - 12 정도면 높은 보안성능으로 간주된다
             *
             * @return { Promise<string> } - 비동기 해쉬 string 값을 반환한다
             */
            return bcript.hash( password , 12 );
        } )
        .then( hashedPassword => {
            resetUser.password = hashedPassword;
            /**
             * - token 필드 제거( undefined )
             */
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        } )
        .then( result => {
            res.redirect( '/login' );
        } )
        .catch( err => console.log( '<<finUserErr>>' , err ) )
}
````

### 권한 추가

- 자신이 생성한 제품만 가져오도록 하는 기능


- 기본적으로는 해당 제품들을 불러올때, 사용자 id 값으로 필터링해서 가져오는 식으로 간단히 구현할 수 있다


````javascript
/** ===== controller/admin.js ===== */
/**
 * - Admin Products Controller
 * @param req
 * @param res
 * @param next
 */
exports.getProducts = ( req , res , next )=> {
    /** 해당 사용자가 생성한 제품만 가져오기 */
    Product.find( {
        userId : req.user._id
    } )
        .then( products => {
            res.render( 'admin/products' , {
                prods : products ,
                pageTitle : 'Admin Products' ,
                path : '/admin/products' ,
            } );
        } )
        .catch( err => console.log( '<<getDataFetchErr>> :' , err ) );
}
````

- 그러나, 현재로써는 보안적인 측면에서는 취약하다고 볼 수 있다


- 제품을 업데이트하거나, 제거할때 사용자를 체크하고 있지 않기때문에, 


- 제품 id 를 알아내어 업데이트 요청 및 삭제요청을 하게 된다면, 해당 제품을 임의로 조작이 가능하다


- 따라서, 제품을 업데이트할때, 해당 제품이 그 사용자에 의해 만들어진 제품인지 추가 검증로직을 추가해야 한다

````javascript
if( req.user._id.toString() !== product.userId.toString() ){
    return res.redirect( '/' );
}
````

- 제품 삭제시에는, deleteOne 메서드를 사용해, productId 및 userId 가 일치하는 제품만 삭제하도록 구현할 수 있다

````javascript
/**
 * - deleteOne 메서드를 사용하면 손쉽게 구현할 수 있다
 *
 * - _id 가 prodId 와 같은지 체크하면서,
 *  userId 또한 req.user._id 와 같은지 체크하면 된다
 */
Product.deleteOne( { _id : prodId , userId : req.user._id } )
        .then( result => {
          res.redirect( "/admin/products" );
        } )
````

---

### Module Summary

- 인증관련 비밀번호 재설정 구현
  - ( 짧은 시간동안만 유효한 비밀번호 토큰을 사용하여, 무차별 대입공격을 방어 )


- 해당 재설정 토큰은 비밀번호를 재설정하려는 사용자를 식별하는 훌륭한 방법
  - ( 토큰은 무작위로 생성되어야 하고, 짧은 시간내에 추측할 수 없어야한다 )
  - ( 따라서, 유효기간등을 추가하여 구현한다 )


- 권한 부여는 사용자들의 액세스를 제한하는 것으로 인증되었다고해서, 모든 일을 할 수는 없도록 한다
  - ( 예를들어 다른사용자의 제품을 수정하는 권한 등 )


- 권한 부여는 대다수 어플리케이션의 필수 요소다