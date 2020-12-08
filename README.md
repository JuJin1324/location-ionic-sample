# location-ionic-sample

## 프로젝트 실행을 위한 공통 과정
### 프로그램 설치
> ```shell
> brew install gradle
> npm i -g cordova
> npm i -g native-run
> npm install -g @ionic/cli
> ```

### 프로그램 버전 확인
> ionic: `ionic -v`  
> Cordova: `cordova -v`  

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
> * 안드로이드 기기 목록 보기: `cordova run android --list`   
> * 안드로이드 실제 기기 목록만 보기: `cordova run android --list --device`  
> * 안드로이드 가상 디바이스 목록만 보기: `cordova run android --list --emulator`  
> 
> PC에 안드로이드 스마트폰을 직접 연결하지 않고 가상 디바이스를 사용하는 경우 `cordova run android --list --emulator` 명령어 실행 후 목록에 아무것도 없으면
> android studio 를 열어서 android 가상 디바이스를 먼저 실행  
> 터미널에서 해당 명령어를 통해서 프로젝트 실행: `ionic cordova run android -l`  

### 참조사이트
> [ionic - Android Development](https://ionicframework.com/docs/developing/android)


## Android Permission API 사용하기
### Android Permission 플러그인 설치
> ```shell
> ionic cordova plugin add cordova-plugin-android-permissions
> npm install @ionic-native/android-permissions
> ```

### app.module.ts
> ```typescript
> import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
> @NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
    providers: [
        StatusBar,
        SplashScreen,
        AndroidPermissions,
        ...
    ],
    ...
})
...
> ```

### home.page.ts
> ```typescript
> import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
> ...
> export class HomePage {
>   ...
>   constructor(private androidPermissions: AndroidPermissions,
>       ...) {
>       this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
>           .then(
>               result => console.log('Has permission?', result.hasPermission),
>               err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
>           );
>       this.androidPermissions.requestPermissions([
>           this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
>           this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
>       ]);
>   }
> ```

## geolocation API 사용하기
### 플러그인 및 npm 설치
> ```shell
> ionic cordova plugin add cordova-plugin-nativegeocoder
> npm install @ionic-native/native-geocoder
> ```

### app.module.ts
> ```typescript
> import { Geolocation } from '@ionic-native/geolocation/ngx';
> @NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        ...
    ],
    ...
})
...
> ```

### home.page.ts
> ```typescript
> import { Geolocation } from '@ionic-native/geolocation/ngx';
> ...
> export class HomePage {
>   ...
>   constructor(private androidPermissions: AndroidPermissions,
>       private geolocation: Geolocation) {
>       ...
>   }
>   options = {
>       timeout: 10000,
>       enableHighAccuracy: true,
>       maximumAge: 3600
>   };
>
>   getCurrentCoordinates() {
>       this.geolocation.getCurrentPosition(this.options).then(resp => {
>           this.data.latitude = resp.coords.latitude;
>           this.data.longitude = resp.coords.longitude;
>           this.data.speed = resp.coords.speed * 3.6 || 0;
>       }).catch(error => {
>           console.log('Error getting location', error);
>       });
>   }
> ...
> ```

### home.page.html
> ```html
> <div id="container">
>    <ion-list>
>      <ion-list-header>
>        <ion-label>Location Coordinates</ion-label>
>      </ion-list-header>
>      <ion-item>
>        <ion-label>
>          Latitude
>        </ion-label>
>        <ion-badge color="danger" slot="end">{{data.latitude}}</ion-badge>
>      </ion-item>
>      <ion-item>
>        <ion-label>
>          Longitude
>        </ion-label>
>        <ion-badge color="danger" slot="end">{{data.longitude}}</ion-badge>
>      </ion-item>
>      <ion-item>
>        <ion-label>
>          Speed
>        </ion-label>
>        <ion-badge color="danger" slot="end">{{data.speed}}</ion-badge>
>      </ion-item>
>    </ion-list>
>    <br/>
>    <ion-button (click)="getCurrentCoordinates()" expand="block">
>      Get Location
>    </ion-button>
>    ...
> </div>
> ```

### 참조사이트
> [ionic Native API - Background Geolocation](https://ionicframework.com/docs/native/background-geolocation)
