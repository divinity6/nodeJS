## Workflow

- Debugging & Easier Development

---

### NPM 스크립트

- Node.js 프로젝트에 몇가지 스크립트를 정의해서, 


- 직접 node 로 실행하는 것이 아니라 npm 을 이용해 도움을 받을 수 있다


- npm 을 이용하여 node 의 초기 프로젝트 설정을 할 수 있다

---

### package.json


- script 값에 원하는 명령어를 추가하여 손쉽게 사용할 수 있다


- start 는 특별한 경우라서 npm start 로 바로 실행이 가능하지만, 


- 다른 스크립트 명령어들을 추가하면 run 을 붙여야한다


- 다른 npm 패키지들은 npm Repository 라는 클라우드 패키지 저장소를 이용해 사용할 수 있다 


- npm i 로 라이브러리를 설치하면 node_modules 에 설치한 모듈의 dependencies 패키지들도 전부 설치가 된다


- terminal 에서 nodemon 패키지를 설치해도 **nodemon 명령어를 사용할 수 없다**


- **Terminal 은 기본적으로 전역( global dependency )에서 해당 명령을 검색**하기 때문에 package.json 의 script 에 명령어로 추가해줘야 사용할 수 있다
  - ( script 는 로컬에서 검색 후 해당 패키지를 실행한다 )