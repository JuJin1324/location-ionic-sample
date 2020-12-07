# location-ionic-sample

## 프로젝트 생성
### ionic 설치
> 터미널: `npm install -g @ionic/cli` 

### 프로젝트 생성
> 프로젝트 담을 디렉터리로 이동 후 다음 명령어 실행: `ionic start [프로젝트 이름] [프로젝트 타입]`  
> UI 가 기본(empty)인 프로젝트 생성: `ionic start location-ionic-sample blank`  

### 프로젝트 실행
> ```shell
> cd location-ionic-sample
> ionic serve
> ```  
> 참조사이트: [ionic 시작](https://ionicframework.com/docs/intro/cli)

## 안드로이드 프로젝트 설정
> 프로젝트 설정 이전에 필요한 프로그램들 설치     
> ```shell 
> brew install gradle
> npm i -g cordova
> npm i -g native-run
> ```  
> 
> android studio 설치 및 android studio 상단 메뉴에서 
>
> ```shell
> ionic cordova prepare android
> ```
