## Intro

- require 함수는 NodeJS 에서 지원하는 함수다


---

### fs 모듈

````javascript
/** 파일 관련 모듈 */
require( 'fs' );

````

````javascript
/**
 * 하드드라이브에 파일을 생성한다
 * 
 * @param { string } path - 파일명이 포함된 파일 경로
 * @param data - 파일의 내용
 */
writeFileSync( path , data )
````

- NodeJS 가 제공하는 파일 시스템 모듈을 활용하여 파일을 생성한다


- NodeJS 환경에서 node 로 해당 명령어를 입력하면 입력을 시작한 위치에 파일이 생성된다