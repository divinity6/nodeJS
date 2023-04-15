## Dynamic Content & Templates

- 지금까지는 정적인 html 페이지를 반환하고 있으나, 일반적으로 실제 어플리케이션에서 하는 행동은 아니다


- 대부분의 상황에서는 정적 html 코드만 존재하는 경우보다, 서버에서 데이터를 관리하는 경우가 빈번하다


> Managing Data( Database 없이... )
> 
> Render Dynamic Content in our Views
> 
> Understanding Templating Engines

- Node.js 내부의 일반적인 변수에 데이터를 저장해 둘 경우, 


- 다른 사용자( 브라우저 )로 접속해도 데이터가 남아 있다
  - ( 데이터가 공유되어 버린다 )


- 데이터베이스에 저장하기도 전에 데이터가 노출되면 안된다


- 따라서, 한 사용자의 여러 요청에 데이터가 공유되는 것은 괜찮지만,


- 여러 유저의 요청에 데이터가 공유되는 것은 문제가 된다

---

### Templating Engines

- html 페이지에 동적 컨텐츠를 넣기위해 사용하는 엔진


> **HTMLish Template**
> - HTML 과 유사한 템플릿
> - 코드, HTML 파일, style , js 등을 작성한다
> 
> **Node/Express Content**
> 
> **Templating Engines**
> 
>  -->
>  
> **Placeholders/Snippets 등을 실제 HTML Content 로 변경**
> 
> -->
> 
> **동적으로 변경된 HTML 파일 제공**

---

### Available Templating Engines

> **EJS**
> 
> 일반적인 html 마크업을 사용하지만, 
> <% 등의 기호를 추가한다
> ````ejs
>   <p><%= name %></p>
> ````
>
> 일반 HTML 을 사용하고 단순한 JS 를 사용할 수 있게하는,
> placeholder 가 있다

> **Pug( Jade )**
> 
> 실제 HTML 을 사용하지 않고 #{}등의 구문으로 표현
> ````jade
>   p #{name}
> ````
>
> 최소 HTML 과 확장 가능하지만, 일련의 요소나 작업종류만을
> 제공하는 맞춤형 템플릿언어를 제공

> **Handlebars**
>
> html 을 사용하지만 동적 컨텐츠의 경우 {{}} 를 사용
> ````handlebars
>   <p> {{ name }} </p>
> ````
> 
> 일반 HTML 을 사용하지만, 제한된 기능의 맞춤형 템플릿 언어도
> 사용한다

- 위 세개는 무료 템플릿 엔진으로 다양한 원리를 이용하여 템플릿을 생성할 수 있고, 


- 동적 컨텐츠를 등록하여 html 파일을 얻을 수 있다