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