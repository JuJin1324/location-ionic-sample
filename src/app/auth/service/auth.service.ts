import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable()
export class AuthService {
    config = {
        url: 'http://192.168.0.98:8087/api/authenticate'
    };

    constructor(private http: HttpClient) {
    }

    login(form) {
        console.log('form.value.id:', form.value.id + ',form.value.password:', form.value.password);
        const reqBody = {
            username: form.value.id,
            password: form.value.password
        };

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            })
        };
        return this.http.post(
            this.config.url, reqBody, httpOptions
        ).pipe(
            retry(2),
            catchError(this.handleError)
        );
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
}

