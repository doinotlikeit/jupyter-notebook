import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, Observable, throwError} from "rxjs";
import {HubTokenResponse} from "./hub-token-response";
import {NGXLogger} from "ngx-logger";
import {HubUserInfoResponse} from "./hub-user-info-response";

@Injectable({
  providedIn: 'root'
})

export class HubManagementService {
  constructor(private logger: NGXLogger, private httpClient: HttpClient) { }

  getUserInfo(userId: string): Observable<HubUserInfoResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": `Bearer ${environment.authToken}`
      })
    };
    let hubTokenUrl = `${environment.juypterHubBaseUrl}/hub/api/users/${userId}`
    this.logger.info(`*** Requesting user info from: ${hubTokenUrl}`)
    return this.httpClient.get<HubUserInfoResponse>(hubTokenUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  startSever(userId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": `Bearer ${environment.authToken}`
      })
    };
    let hubUrl = `${environment.juypterHubBaseUrl}/hub/api/users/${userId}/server`
    this.logger.info(`*** Requesting new server creation from: ${hubUrl}`)
    return this.httpClient.post<any>(hubUrl, "", httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  stopSever(userId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": `Bearer ${environment.authToken}`
      })
    };
    let hubUrl = `${environment.juypterHubBaseUrl}/hub/api/users/${userId}/server`
    this.logger.info(`*** Requesting stop server from: ${hubUrl}`)
    return this.httpClient.delete(hubUrl, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  getNewToken(userId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": `Bearer ${environment.authToken}`
      })
    };
    let hubTokenUrl = `${environment.juypterHubBaseUrl}/hub/api/users/${userId}/tokens`
    this.logger.info(`*** Requesting new token from: ${hubTokenUrl}`)
    return this.httpClient.post<any>(hubTokenUrl, "", httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      return throwError(() => new Error(`Client-side error, HTTP code: ${error.status}, message: ${error.error.message}`));
    } else {
      // The backend returned an unsuccessful response code.
      return  throwError(() => new Error(
        `Server-side error, HTTP code: ${error.status}, response body: ${error.error.message}`));
    }
  }
}
