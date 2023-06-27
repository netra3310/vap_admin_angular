import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
// import { UserModel } from '../../models/user.model';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/Helper/models/Login';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';

import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { CredentialsService } from 'src/app/shared/services/credentials.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { ShellPermissionEnum } from 'src/app/shared/constant/shell-permission';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    username: 'Leonardo',
    password: 'vpleo33',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  IsSpinner = false;
  public loginmodel: Login;
  public usermodel: UserModel;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private vaplongservice: vaplongapi, 
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private credentialsService: CredentialsService,
    private permission: PermissionService, 
    private storageService: StorageService, 
    private toastService : ToastService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/']);
    // }
    this.loginmodel = new Login();
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: [
        this.defaultAuth.username,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  // submit() {
  //   let loginData = new Login();
  //   loginData.UserName = this.f.email.value;
  //   loginData.Password = this.f.password.value;

  //   this.hasError = false;
  //   const loginSubscr = this.authService
  //     .login(loginData)
  //     .pipe(first())
  //     .subscribe((user: UserModel | undefined) => {
  //       if (user) {
  //         this.router.navigate([this.returnUrl]);
  //       } else {
  //         this.hasError = true;
  //       }
  //     });
  //   this.unsubscribe.push(loginSubscr);
  // }

  validateFields() {
    // tslint:disable-next-line: deprecation
    if(this.f.username.value==null || this.f.username.value==""|| this.f.username.value==undefined) {
     
      this.toastService.showInfoToast("Info", "Please enter your username");
      return false;
    } 
    else if(this.f.password.value==null || this.f.password.value=="" || this.f.password.value==undefined)
    {
      this.toastService.showInfoToast("Info", "Please enter your password");

      return false;
    }
    else {
      return true;
    }
  }

  loginuser() {
    if (!this.validateFields()) {
      return;
    }
    this.IsSpinner = true;
    this.loginmodel.UserName = this.f.username.value;
    this.loginmodel.Password = this.f.password.value;

    this.authService.login(this.loginmodel).subscribe((token) => {
      if (localStorage.getItem('access_token')) {

        this.vaplongservice.UserLogin(this.loginmodel).pipe(untilDestroyed(this)).subscribe(response => {
          console.log('user login response is ', response);
          this.usermodel = response;
          if (response.ResponseCode === 0) {
            this.storageService.setItem('SessionStartTime', new Date());
            this.storageService.setItem('UserModel', response.UserModel);
            this.usermodel = this.storageService.getItem('UserModel');
            this.credentialsService.loadPermission();
            this.storageService.setItem('UserModel', response.UserModel);
            this.IsSpinner = false;

            //custom start
            this.router.navigate([this.returnUrl]);
            //custom end
            //this.CheckUserOpenCashRegisterByUserID(response.UserModel.ID);
          }
          else {
            this.IsSpinner = false;
            // console.log('login error', NotificationEnum.ERROR);
            this.toastService.showErrorToast('Error', 'invalid username and password');
          }
        });
      }
    }, (err: any) => {
      this.IsSpinner = false;
      this.toastService.showErrorToast('Error', err);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
