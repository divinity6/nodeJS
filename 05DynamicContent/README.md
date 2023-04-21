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

---

### Pug

````shell
npm i --save ejs pug express-handlebars
````

- 위의 설치한 세개의 파일은 express 에 의존된 패키지들이다


- app.set 에 사용자 정의 string 을 넣으면 해당 값을 반환하지만,


- built-in string 을 넣으면 두번째 파라미터 값으로 해당 built-in 객체를 설정하겠다는 뜻이다
  - 예) 'view-engin' , 'pug' : Pug 를 사용하여 view engine 을 설정한다는 뜻

````javascript
/** app.set 으로 전체 global 구성 값을 설정할 수 있다 */
app.set( 'title' , 'My Site' );
/** app.get 으로 해당 값을 가져올 수 있다 */
app.get( 'title' ); // My Site
````

- pug 를 활용하여 동적으로 HTML 을 컴파일하고, 렌더링할 장소를 가르켜주고 있다

````javascript
/**
 * - pug 라이브러리를 view engine 으로 사용
 */
app.set( 'view engine' , 'pug' );
/**
 * - 서버에서 렌더링 할 뷰가 위치한 디렉토리 경로를 설정하는 역할.
 */
app.set('views', 'directory_path');
````

#### shop.pug

- pug 는 일반 html 과 다르게 동작한다


- pug 엔진이 코드를 일반 HTML 코드로 컴파일 해준다


- pug 는 들여쓰기로 구문을 분석하므로 들여쓰기가 매우 중요하다


- app.set 으로 pug 를 사용한다고 알렸지만, 사용하지 않는다
  - 내보내는 파일이 일반 html 이기 때문...
  

````javascript

/**
 * index 라는 이름의 뷰 파일을 렌더링하고, 
 * 그 결과를 클라이언트에게 응답으로 보내주는 예시
 */
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

````

- view 템플릿을 렌더링하여 HTML 문자열을 생성하고, 응답을 클라이언트에 보내준다


- view 엔진 설정 및 view 파일의 경로, 이름 데이터를 파라미터로 받는다


- 두 번째 파라미터로 해당 렌더링 파일에 값을 전달해 줄 수 있다

````jade
   each product in prods
````
- vue 의 v-for 처럼 반복하는 pug 문법 


- pug 를 이용하여 데이터가 변경되면, 자동으로 화면에 렌더링된다( nodemon 이 아닌, 일반 node 로 실행시에도... )
  - ( 템플릿은 서버측 코드에 포함되지 않고 클라이언트 코드이기 때문 )

- Pug에 대해 더 알고 싶으시다면 다음 링크에서 공식 참고자료를 확인해보세요. 
  - https://pugjs.org/api/getting-started.html

---

### Pug layout

- pug 또한, vue 처럼 layout 을 지원한다


#### 내부 컨텐츠 정의시

````jade
   block 이위치에들어갈훅이름
````

- block 훅 으로 해당 blcok 영역에 들어갈 컨텐츠를 동적으로 넣어줄 수 있다

#### 해당 block hook 사용시

````jade
extends 상속받을pug파일경로

   block 훅이름
        들여쓰기 후, 삽입할 컨텐츠 작성
````

- 이렇게 content 를 삽입할 수 있다

#### pug 에서 js 문법 사용시

````jade
extends 상속받을pug파일경로
a(class=(path === '/admin/add-product' ? 'active' : ''))
````

-  일반적으로 active 를 줄때 router 의 path 경로를 이용하여 active 를 주는것이 확실하다


- 또한, ()안에 작성한 코드들은 간단한 js 문법으로 비교할 수 있다

---

### Handlebars

- 또다른 Template engine 이다


- Pug 는 내장된 engine 이지만, Express handlebars 는 아니다

````javascript
  /**
    * - 등록되지 않은 새로운 템플릿엔진을 등록하는 메서드
    * 
    * @param { string } 뷰엔진의 확장자 - hbs or handlebars
    * @param { any } renderingFnc - 뷰엔진의 렌더링 함수 
    */
    app.engine( "hbs" , expressHbs() );

    /**
     * - handlebars 라이브러리를 view engine 으로 사용
     */
    app.set('view engine', 'hbs');
````

- view 엔진으로 handlebars 를 등록하면, view 엔진이 handlebars 로 변경된다


- handlebars 는 일반 html 구문과 비슷하다( pug 만큼 미니멀하지 않다 )

> ````handlebars
>   <p> {{ pageTitle }} </p>
> ````

- js 코드를 사용하는 방법은 {{}} 를 이용하여 안에 작성한다
  - ( vue 처럼... )

````handlebars
{{!-- 조건식 --}}
{{#if 조건식}}
   조건식이 참일 때 출력될 내용
{{/if}}

{{!-- 반복문 --}}
{{#each 배열}}
  배열의 요소에 대한 출력 내용
{{/each}}

{{!-- 주석 내용 --}}
````



````handlebars

{{!-- 표현식을 허용하지 않음 --}}
{{#if prods.length > 0 }}

{{!-- 선언만 가능 --}}
{{#if hasProduct }}
````

- 핸들바는 내부문법에서 표현식을 허용하지 않고, 선언값만 true, false 로 구분한다


- 즉, express 에서 해당 값을 연산 후, 결괏값을 template 에서 사용해야 한다

````handlebars

{{#each prods}}
  {{!-- this 로 Loop 를 도는 객체의 프로퍼티에 접근가능 --}}
  {{ this.title }}
{{/each}}
````

- handlebars 는 this 로 자기자신을 가진 객체에 접근가능하다


- handlebars 는 template 에 논리를 두지않고, js 에서 모든 로직을 처리한 후 데이터만 작성할 수 있다