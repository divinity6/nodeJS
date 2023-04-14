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