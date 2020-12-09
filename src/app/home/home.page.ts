import {Component} from '@angular/core';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationEvents,
    BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import {Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    config = {
        /* URL 서버의 CORS 설정이 되어 있어야 정상 작동함. */
        url: 'http://192.168.0.98:8087/gps/send',
        sendIntervalSec: 10
    };
    data = {
        latitude: 0.0000000,
        longitude: 0.0000000,
        speed: 123,     /* km/h */
        azimuth: 360,   /* degree (range: 0 ~ 360) */
        timestamp: null
    };
    watch = null;
    interval = null;
    disableStartBtn = false;
    disableStopBtn = true;

    constructor(private androidPermissions: AndroidPermissions,
                private geolocation: Geolocation,
                private backgroundGeolocation: BackgroundGeolocation,
                private http: HttpClient) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            .then(
                result => console.log('Has permission?', result.hasPermission),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            );
        this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
            this.androidPermissions.PERMISSION.INTERNET,
        ]).then(r => console.log('require permission has called:', r));
    }

    startBackgroundGeolocation() {
        const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true,
            interval: 500,
            stopOnTerminate: false,
        };
        /* TODO: 에러 남 추가 확인 필요 */
        this.backgroundGeolocation.configure(config).then(() => {
            this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
                console.log('background tracking:', location);

                this.data.latitude = location.latitude;
                this.data.longitude = location.longitude;
                this.data.speed = location.speed * 3.6 || 0;
                this.data.timestamp = location.time;
            });
        });
        this.backgroundGeolocation.start();

        if (!this.watch) {
            const options = {
                timeout: 10000,
                enableHighAccuracy: true,
                frequency: 500,
                maximumAge: 3600
            };
            this.watch = this.geolocation.watchPosition(options)
                .subscribe((position: Geoposition) => {
                    console.log('foreground position:', position);
                    this.data.latitude = position.coords.latitude;
                    this.data.longitude = position.coords.longitude;
                    this.data.speed = position.coords.speed * 3.6 || 0;
                    this.data.timestamp = position.timestamp;
                });
        }

        this.interval = setInterval(() => {
            this.sendGPS(this.data);
        }, this.config.sendIntervalSec * 1000);

        this.disableStartBtn = true;
        this.disableStopBtn = false;
    }

    stopBackgroundGeolocation() {
        console.log('Stop button Clicked');
        this.backgroundGeolocation.stop();
        if (this.watch) {
            this.watch.unsubscribe();
            this.watch = null;
        }
        clearInterval(this.interval);

        this.disableStartBtn = false;
        this.disableStopBtn = true;
    }

    // Handle API errors
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }

    sendGPS(data) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Receipt-company': 'Centum Factorial',
                'Phone-number': '010-4171-9008',
                'Occurred-date': this.getDateString(data.timestamp),
                'Report-period': '60'
            })
        };
        const reqBody = {
            latitude: data.latitude,
            longitude: data.longitude,
            temperature1: '-5555',
            temperature2: '-5555',
            temperature3: '-5555',
            speed: data.speed,       /* km/h */
            azimuth: data.azimuth,   /* degree (range: 0 ~ 360) */
        };
        this.http.post(this.config.url, reqBody, httpOptions)
            .pipe(
                retry(2),
                catchError(this.handleError)
            )
            .subscribe(resBody => {
                console.log(resBody);
            });
    }

    getDateString(timestamp) {
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hour = String(date.getUTCHours()).padStart(2, '0');
        const minute = String(date.getUTCMinutes()).padStart(2, '0');
        const second = String(date.getUTCSeconds()).padStart(2, '0');
        const millisecond = String(date.getUTCMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`;
    }
}
