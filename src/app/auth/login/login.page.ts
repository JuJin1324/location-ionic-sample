import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../service/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    token: string;
    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit() {
    }

    /* 참조사이트: https://www.techiediaries.com/ionic-ui-forms-theming/ */
    login(form) {
        this.authService.login(form).subscribe((resBody: AuthResponseBody) => {
            this.token = resBody.token;
            console.log('this.token:', this.token);
            this.router.navigateByUrl('home').then(r => console.log('success to navigate to home:', r));
        });
    }
}

class AuthResponseBody {
    token: string;
    constructor() {
    }
}
