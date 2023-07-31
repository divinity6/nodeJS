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
