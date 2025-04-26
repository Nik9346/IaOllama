import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development'; 
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { IChatRequest } from '../models/chat.models';
import oboe, { Oboe } from 'oboe';
import { IChatFinalResponse } from '../models/chat_response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api_url: string = '';
  API_TIMEOUT = 900000;
  httpOptions: any;
  constructor(private http: HttpClient, private router: Router) {
    if (environment.production) {
      let context = window.location.pathname.substring(
        0,
        window.location.pathname.indexOf('/', 2)
      );
      this.api_url =
        window.location.protocol +
        '//' +
        window.location.host +
        context +
        '/api';
    } else {
      this.api_url = environment.apiUrl;
    }
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }
  formatErrors(err: any): string {
    if (err && err.error && err.error.message) {
      return (err = err.error.message);
    } else {
      return err;
    }
  }

  private redirectToErrorPage() {
    /* TODO: uncomment these lines
    this.router.navigate(['/error'], {
      skipLocationChange: true
    });
    */
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.api_url}${path}`, { params }).pipe(
      timeout(this.API_TIMEOUT),
      catchError((e) => {
        this.redirectToErrorPage();
        return throwError(e);
      })
    );
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${this.api_url}${path}`, JSON.stringify(body), this.httpOptions)
      .pipe(
        timeout(this.API_TIMEOUT),
        catchError((e) => {
          this.redirectToErrorPage();
          return throwError(e);
        })
      );
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${this.api_url}${path}`, JSON.stringify(body), {
        responseType: 'text',
        observe: 'body',
      })
      .pipe(
        timeout(this.API_TIMEOUT),
        catchError((e) => {
          this.redirectToErrorPage();
          return throwError(e);
        })
      );
  }

  postWithFullHeadersResponse(
    path: string,
    body: Object = {}
  ): Observable<any> {
    return this.http
      .post(`${this.api_url}${path}`, JSON.stringify(body), {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response',
        responseType: 'json',
      })
      .pipe(
        timeout(this.API_TIMEOUT),
        catchError((e) => {
          this.redirectToErrorPage();
          return throwError(e);
        })
      );
  }

  delete(path: any): Observable<any> {
    return this.http.delete(`${this.api_url}${path}`).pipe(
      timeout(this.API_TIMEOUT),
      catchError((e) => {
        this.redirectToErrorPage();
        return throwError(e);
      })
    );
  }
}
