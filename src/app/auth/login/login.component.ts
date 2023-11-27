import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PATTERNS, ROUTES } from 'src/app/shared/constants';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GoogleAnalytics } from 'src/app/shared/services/google-analytics.service';
export type EventType = 'ROAD' | 'TRAIL' | 'SPRINT' | 'SUNSET' | 'TRAIL_SPRINT';
export interface IRedirectParams {
  stateName: string
  params: Object
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formSubmitted: boolean = false;
  public errorType: string = '';
  routes = ROUTES;
  eventType: EventType = 'TRAIL';
  loginType: string = '';
  eventId: string = '';
  redirectParams: any;
  accountNotExists: boolean = false;
  incorrectPassword: boolean = false;
  inputFocusCount = 0;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(PATTERNS.EMAIL),
    ]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private GoogleAnalytics: GoogleAnalytics
  ) { 
  }
  ngOnInit(): void {
    this.GoogleAnalytics.sendingPageInitToGoogleAnalytics('team_builder_login', this.loginForm.value.email ? this.loginForm.value.email : "", 'login');

    const params = sessionStorage.getItem('redirect-params');
    console.log("🚀 ~ file: login.component.ts:45 ~ LoginComponent ~ ngOnInit ~ params:", params)
    if (params) {
      this.loginType = JSON.parse(params).params.loginType;
      this.eventType = JSON.parse(params).params.type;
      this.eventId = JSON.parse(params).params.regConfigId;
      this.redirectParams = JSON.parse(params);
    }
  }

  login() {
    let userType =
      this.loginType === 'groupVolunteer' ? 'GROUP_VOLUNTEER_LEADER' : 'User';
    const email = this.loginForm.value.email.trim();
    this.loginForm.controls['email'].setValue(email);
    this.authService.login(this.loginForm.value, userType).subscribe({
      next: (user: any) => {
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
          formName: 'team_builder_login',
          formStatus: 'success',
          email: email,
        });
        // let params = this.AuthService.getRedirectParams();
        
        localStorage.setItem('jwtToken-user', user.jwtToken);
        this.authService.setUser({...user, email: user.emailAddress});
        const redirectUrl = 'team-builder/'+this.eventId + '/registration/' +  this.loginType 
        
            this.router.navigate([redirectUrl]);
          
      },
      error: (error) => {
        console.log('error', error);
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
          'FORM_SUBMIT',
          {
            formName: 'team_builder_login',
            formStatus: 'failed',
            email: email,
          }
        );
        this.errorType = error.error.code;
        console.log('errorType', this.errorType);
        if (error.error.code === 'PasswordResetRequiredException') {
          localStorage.setItem('userEmail', email);
          this.router.navigate([ROUTES.CHANGE_PASSWORD]);
        }
      },
    });
  }
  // onSignIn() {
  //   this.router.navigate([ROUTES.SIGNUP]);
  //   this.formSubmitted = true;
  // }

  formElementEnter(form: any) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_ENTER', {
            formName:  'team_builder_login',
            ...this.getDataLayerFormObj(form),
        })
    }
  }

  formElementExit(form: any) {
    this.inputFocusCount = 0;
    this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_EXIT', {
        formName:  'team_builder_login',
        ...this.getDataLayerFormObj(form),
    })
  }

  getDataLayerFormObj(form: any) {
    const formFields: any = {};
    Object.keys(form).forEach((key: any) => {
      if (!key.includes('$')) {
        if (!key.includes('password')) {
          formFields[key] = form[key]['$modelValue'] || '';
        }
      }
    });
    return formFields;
  }
}
