# location-ionic-sample

## 프로젝트 실행을 위한 공통 과정
### 프로그램 설치
> ```shell
> brew install gradle
> npm i -g cordova
> npm i -g native-run
> npm install -g @ionic/cli
> ```

### android 가상 디바이스 추가  
> android studio 설치 [설치 페이지 링크](https://developer.android.com/studio)   
> android studio 실행 후 상단 메뉴 Tools -> AVD Manager 를 통해서 안드로이드 가상 디바이스 추가

### 환경 변수 설정
> android 실행 관련 환경 변수 추가
> ```shell
> # bash 사용자
> $ vi ~/.bashrc
> 
> # zsh 사용자
> $ vi ~/.zshrc
> 
> # 문서 가장 아래에 내용 추가
> export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
> export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
> export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
> export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
> ```

## 프로젝트 생성 [git clone 한 경우 필요 넘어가기]
### 웹 프로젝트 생성 
> 프로젝트 담을 디렉터리로 이동 후 다음 명령어 실행: `ionic start [프로젝트 이름] [프로젝트 타입]`  
> UI 가 기본(empty)인 프로젝트 생성: `ionic start location-ionic-sample blank`  

### 웹 프로젝트를 안드로이드 프로젝트로 변경
> android 프로젝트로 변경 [프로젝트를 새로 생성하지 않은 경우 넘어가기]
> 기존 ionic 웹 프로젝트를 android 프로젝트로 변경
> ```shell
> ionic cordova prepare android
> ```

## 프로젝트 시작
### npm 
> `npm install` 을 통해서 npm module 가져오기

### 프로젝트 실행
> PC에 안드로이드 스마트폰을 직접 연결하지 않고 가상 디바이스를 사용하는 경우 android 가상 디바이스를 먼저 실행  
> 터미널에서 해당 명령어를 통해서 프로젝트 실행: `ionic cordova run android -l`  

