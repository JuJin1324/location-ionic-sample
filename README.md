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

## 프로젝트 시작
### 웹 프로젝트를 안드로이드 프로젝트로 변경
> android 프로젝트로 변경
> 기존 ionic 웹 프로젝트를 android 프로젝트로 변경
> ```shell
> ionic cordova prepare android
> ```

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
>   watch = null;
> 
>   constructor(private androidPermissions: AndroidPermissions,
>       private geolocation: Geolocation) {
>       ...
>   }
>   const options = {
>       timeout: 10000,
>       enableHighAccuracy: true,
>       frequency: 500,
>       maximumAge: 3600
>   };
>   this.watch = this.geolocation.watchPosition(options)
>       .subscribe((position: Geoposition) => {
>           console.log('foreground position:', position);
>           this.data.latitude = position.coords.latitude;
>           this.data.longitude = position.coords.longitude;
>           this.data.speed = position.coords.speed * 3.6 || 0;
>           this.data.timestamp = position.timestamp;
>       });
> ...
> ```

## HTTP Client
### 플러그인 및 npm 설치
> angular 모듈 사용으로 인해 추가 설치 필요 없음.

### app.module.ts
> ```typescript
> import {HttpClientModule} from '@angular/common/http';
> @NgModule({
>    declarations: [AppComponent],
>    entryComponents: [],
>    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HttpClientModule],
>    providers: [
>        StatusBar,
>        SplashScreen,
>        Geolocation,
>        ...
>    ],
>    ...
> })
...
> ```

### home.page.ts
> ```typescript
> import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
> import {throwError} from 'rxjs';
> import {catchError, retry} from 'rxjs/operators';
> ...
> export class HomePage {
>   ...
>   watch = null;
> 
>   constructor(...,
>       private http: HttpClient) {
>       ...
>   }
>   ...
>   // Handle API errors
>   handleError(error: HttpErrorResponse) {
>       if (error.error instanceof ErrorEvent) {
>           // A client-side or network error occurred. Handle it accordingly.
>           console.error('An error occurred:', error.error.message);
>       } else {
>           // The backend returned an unsuccessful response code.
>           // The response body may contain clues as to what went wrong,
>           console.error(
>               `Backend returned code ${error.status}, ` +
>               `body was: ${error.error}`);
>       }
>       // return an observable with a user-facing error message
>       return throwError(
>           'Something bad happened; please try again later.');
>   }
>
>   sendGPS(reqBody) {
>       const httpOptions = {
>           headers: new HttpHeaders({
>               'Content-Type': 'application/json'
>           })
>       };
>       this.http.post(
>           this.config.url, reqBody, httpOptions
>       ).pipe(
>           retry(2),
>           catchError(this.handleError)
>       ).subscribe(resBody => {
>           console.log(resBody);
>       });
>   }
> ```

### 참조사이트
> [ionic Native API - Background Geolocation](https://ionicframework.com/docs/native/background-geolocation)
