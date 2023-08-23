## FileUploadDownload

- 파일 업로드 및 다운로드


- 들어오는 요청을 간편하게 해석하기위해 bodyParser 미들웨어를 사용하는데, 해당 미들웨어는 여러가지 파서를 제공한다


- 현재는 urlencoded 파서를 사용하며, URL 인코딩된 데이터는 **텍스트 데이터**다


-즉, 파일없이 텍스트 필드만 html form 에서 제출된 경우, 


- 텍스트 필드에 number , URL , string 의 저장 여부등을 불문하고,


- 모두 text 로 인코딩되어 제출된다


- 그런데, 파일의 경우 기본적으로 이진 데이터이기 때문에 텍스트로 추출할 수 없다


````javascript
/** ===== app.js ===== */
const bodyParser = require( 'body-parser' );
/**
 * - 본문 해석 미들웨어
 *
 * - urlencoded 메서드는 내부에서 next 를 호출하여
 *
 * - 다음 라우팅 미들웨어를 실행하도록 해준다
 */
app.use( bodyParser.urlencoded({ extended : false } ) );
````

- 따라서, 파일업로드 처리를 하려면 다른 종류의 파서를 설치해 처리해야 한다


- Multer

````shell
npm i --save multer
````

- multer 는 들어오는 요청을 분석하는 또다른 패키지인데,


- 텍스트와 파일이 혼합된 데이터의 요청도 처리할 수 있다


- 또한, view 의 <form></form> 태그에서 enctype 으로 전송하는 데이터의 인코딩 타입을 변경해야한다
  - application/x-www-form-urlencoded : 기본값( 모든 문자 인코 )
  - multipart/form-data : 모든 문자 인코딩하지 않음
  - text/plain : 공백문자는+로 변환하지만, 나머지는 인코딩하지 않음


- form 의 인코딩 타입을 multipart/form-data 로 설정해주면, 


- multer 가 들어오는 요청을 탐색하고 텍스트와 파일을 모두 분석할 수 있다

````ejs
<form
        class="product-form"
        action="/admin/<% if (editing) { %>edit-product<% } else { %>add-product<% } %>"
        method="POST"
        enctype="multipart/form-data">
</form>
````
---
