import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {FormsModule} from '@angular/forms';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth/service/auth.service';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HttpClientModule],
    providers: [
        StatusBar,
        SplashScreen,
        AndroidPermissions,
        Geolocation,
        AuthService,
        BackgroundGeolocation,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
