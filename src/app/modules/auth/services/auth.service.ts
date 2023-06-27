import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../../../Helper/models/UserModel';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TokenService } from '../../../Service/token.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Login } from 'src/app/Helper/models/Login';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CredentialsService } from 'src/app/shared/services/credentials.service';

export type UserType = UserModel | undefined;

const API_URL = environment.API_URL;
const HTTP_OPTIONS = {
    headers: new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('APIKey', 'AccuritaAPIKey987654321')
        .set('Access-Control-Allow-Origin', '*')
};

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  redirectUrl = '';
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;;

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
        // alert('An error occurred:'+ error.error.message);
        // console.error('An error occurred:', error.error.message);
    } else {
        // console.error(
        //     `Backend returned code ${error.status}, ` +
        //     `body was: ${error.error}`);
        // alert(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(
        alert('Authentication error occurred, IP not White Listed or Incorrect Username/Password')
    );
  }
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields

  get currentUserValue(): UserType {
    // return this.currentUserSubject.value;
    return this.storageService.getItem('UserModel');
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
    // this.storageService.setItem();
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router, 
    private http: HttpClient, 
    private tokenService: TokenService,
    private storageService: StorageService,
    private readonly credentialsService: CredentialsService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
  }

  // public methods 
  // login(email: string, password: string): Observable<UserType> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.login(email, password).pipe(
  //     map((auth: AuthModel) => {
  //       const result = this.setAuthFromLocalStorage(auth);
  //       return result;
  //     }),
  //     switchMap(() => this.getUserByToken()),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  login(loginData: any): Observable<any> {
    this.isLoadingSubject.next(true);
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
        .set('username', loginData.UserName)
        .set('password', loginData.Password)
        .set('grant_type', 'password');
    return this.http.post<any>(API_URL + 'token', body, HTTP_OPTIONS)
        .pipe(
            
            tap(res => {

                this.tokenService.saveToken(res.access_token);
                this.tokenService.saveRefreshToken(res.access_token);
                this.isLoadingSubject.next(false);
            }),
            catchError(AuthService.handleError)
        );
  }

  logout() {
    console.log('logout');
    this.credentialsService.logout();
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  // getUserByToken(): Observable<UserType> {
  //   const auth = this.getAuthFromLocalStorage();
  //   if (!auth || !auth.authToken) {
  //     return of(undefined);
  //   }

  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.getUserByToken(auth.authToken).pipe(
  //     map((user: UserType) => {
  //       if (user) {
  //         this.currentUserSubject.next(user);
  //       } else {
  //         this.logout();
  //       }
  //       return user;
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  // need create new user then login
  // registration(user: UserModel): Observable<any> {
  //   this.isLoadingSubject.next(true);
  //   let loginData = new Login();
  //   loginData.UserName = user.username
  //   return this.authHttpService.createUser(user).pipe(
  //     map(() => {
  //       this.isLoadingSubject.next(false);
  //     }),
  //     switchMap(() => this.login(user.email, user.password)),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  // forgotPassword(email: string): Observable<boolean> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService
  //     .forgotPassword(email)
  //     .pipe(finalize(() => this.isLoadingSubject.next(false)));
  // }

  // private methods
  // private setAuthFromLocalStorage(auth: AuthModel): boolean {
  //   // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
  //   if (auth && auth.authToken) {
  //     localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
  //     return true;
  //   }
  //   return false;
  // }

  // private getAuthFromLocalStorage(): AuthModel | undefined {
  //   try {
  //     const lsValue = localStorage.getItem(this.authLocalStorageToken);
  //     if (!lsValue) {
  //       return undefined;
  //     }

  //     const authData = JSON.parse(lsValue);
  //     return authData;
  //   } catch (error) {
  //     console.error(error);
  //     return undefined;
  //   }
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
