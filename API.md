API document
=============

### ● 차례
+ **/user**
+ **/page**
+ **/report**

<br/>

### ● 동적 데이터
+ **:userid** - 사용자 식별 key
+ **:admin** - 관리자 key
+ **:mode** - GET 모드
  - all: 전부 가져오기
  - frontN: 최신 순으로 N개 가져오기
  - backN: 오래된 순으로 N개 가져오기
+ **:url** - 페이지 URL

<br/>

### ● DB 구조
+ **User** - id, key, rank, eval_count, report_count, 
+ **Page** - id, like, bad, url, danger, person
+ **Report** - id, reporter, url, reason, created_at

<br/>

### ● 주의사항
+ 관리자 key 를 필요로 하는 API 의 경우 되도록 사용하지 않도록 합니다.
+ POST 요청을 하는 경우 주어진 양식에 맞게 데이터를 전송합니다.
+ 불필요한 API 요청은 줄이도록 합니다.

<br/>

---------------------------------------
<br/>

## ▶ **/user**

+ **GET**
  - **/list/:admin** - 전체 사용자 key 목록
  - **/get/:userid** - key 에 해당하는 사용자 정보
+ **POST**
  - **/new** - ( 사용자 key ) 새 사용자 등록
  - **/update** - ( 업데이트 객체 ) 사용자 정보 업데이트

<br/>

## ▶ **/page**

+ **GET**
  - **/get/url/:admin** - 전체 페이지 URL 목록
  - **/get/eval/:admin/:mode** - 페이지 평가기록 목록
  - **/get/:url** - URL 에 해당하는 페이지 정보


+ **POST**
  - **/new/eval** - ( URL, 사용자 key ) 새 페이지 평가
  - **/new/eval**

<br/>

## ▶ **/report**