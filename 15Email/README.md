## Email 전송

- Node 어플 내부에서 이메일을 전송하는 방법

---

### How Does Sending Mails Work?

- NodeJS 로는 메일서버를 간단하게 만들 수 없다


- 메일을 처리하는 것은 req 와 res 를 처리하는 것과는 완전 다르다
  - ( 수천 , 수만건의 메일을 처리하는 서버를 구축하는것은 보안등 여러 측면에서 매우 복잡한 일이다 )


- 따라서, 현실적으로는 Third-Party 메일 서버를 사용하게 된다
  - 즉, AWS 등 제 3자 서비스를 통해 메일을 발송하게 된다

    
---

### Use SendGrid

- SendGrid 를 통해 메일을 발송한다 - 하루 100건 무료
  - ( Mailchimp , AWS , SCS 등의 많은 대체서비스들이 존재한다 )
  - Nodemailing 이라 검색하면 많은 서비스들이 제공된다

---

- 메일을 보낼경우, Nodejs 에서 쉽게 메일을 보낼수 있게해주는 패키지인, nodemailer 패키지를 설치한다

````shell
npm i --save nodemailer
````


- sendgrid 서비스를 이용할 경우, 해당 서비스와 상호작용하며, 통합시켜주는 nodemailer-sendgrid-transport 패키지도 설치한다


````shell
npm i --save nodemailer-sendgrid-transport
````


- sendgrid 에서 메일서비스를 생성하려면 계정에서 api_key 를 생성해야 한다


- 방법은, [ 생성 url ]( https://app.sendgrid.com/settings/api_keys ) 에서 생성할 수 있다
  - ( UI 로 클릭해 들어간다면, settings > APIkeys )


- API Key Name 은 원하는대로 정의하면 된다


- API key 를 생성하면 auth 객체의 key 에 매핑해주면 된다

````javascript
const nodemailer = require( 'nodemailer' );
const sendgridTransport = require( 'nodemailer-sendgrid-transport' );

const User = require( '../models/user' );

/**
* - createTransport 에 sendgridTransport 의 환경값을 설정한다
*
* --> 즉, createTransport 에서 sendgridTransport 패키지를 이용해 메일을 보낸다
*
* --> transporter 객체를 생성할때, auth 의 api_user , api_key 가 필요한데 Send_Grid 계정 에서 확인할 수 있다
*
* @see ( https://sendgrid.com/ )
  */
const transporter = nodemailer.createTransport( sendgridTransport( {
  auth : {
    api_key :`${ API_KEY }`,
  }
} ) );
````


- sendMail 의 파라미터에 발송 하려는 이메일의 설정을 입력해주면 된다

````javascript

exports.postSignup = (req, res, next) => {
  User.findOne( { email } )
          .then( () => {
            /**
             * - to :  누구에게 메일을 보내는지
             * - from :  누가 메일을 보내는지
             * - subject : 제목
             * - html : 내용
             * 
             * @reutn { Promise } - promise 객체를 반환한다
             */
             return transporter.sendMail( {
              to : email,
              from : 'shop@node-complete.com',
              subject : 'Signup succeeded!',
              html : '<h1>You successfully signed up!</h1>'
            } ); 
          } )
          /** 추가 로직 */
          .then( () => { ... } )
    
}
````

- 현재 메일을 보내려면 도메인이나, 발신자 신원을 인증해야함


- [ see ]( https://docs.sendgrid.com/ui/sending-email/sender-verification )