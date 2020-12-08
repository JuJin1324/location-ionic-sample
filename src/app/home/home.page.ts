import {Component} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    data = {
        latitude: 0.0000000,
        longitude: 0.0000000,
        speed: 123,     /* km/h */
        azimuth: 360,   /* degree (range: 0 ~ 360) */
    };

    constructor(private androidPermissions: AndroidPermissions,
                private geolocation: Geolocation) {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            .then(
                result => console.log('Has permission?', result.hasPermission),
                err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
            );
        this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
        ]);
    }

    options = {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 3600
    };

    getCurrentCoordinates() {
        this.geolocation.getCurrentPosition(this.options).then(resp => {
            this.data.latitude = resp.coords.latitude;
            this.data.longitude = resp.coords.longitude;
            this.data.speed = resp.coords.speed * 3.6 || 0;
        }).catch(error => {
            console.log('Error getting location', error);
        });
    }
}
