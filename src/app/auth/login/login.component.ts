import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PATTERNS, ROUTES } from 'src/app/shared/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginType: string = '';
  public eventType: string = '';
  public formSubmitted: boolean = false;
  public errorType: string = '';
  routes = ROUTES;
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventType = this.activatedRoute.snapshot.queryParams['type'];
    this.loginType = this.activatedRoute.snapshot.queryParams['loginType'];
  }

  login() {
    console.log('login form', this.loginForm);
    let userType =
      this.loginType === 'groupVolunteer' ? 'GROUP_VOLUNTEER_LEADER' : 'User';
    const email = this.loginForm.value.email.trim();
    this.loginForm.controls['email'].setValue(email);
    this.authService.login(this.loginForm.value, userType).subscribe({
      next: (user: any) => {
        // this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
        //   formName: 'team_builder_login',
        //   formStatus: 'success',
        //   email: email,
        // });
        console.log('user', user);
        // let params = this.AuthService.getRedirectParams();
        localStorage.setItem('jwtToken-user', user.jwtToken);
        this.authService.setUser(user);
      },
      error: (error) => {
        console.log('error', error);
        // this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
        //   'FORM_SUBMIT',
        //   {
        //     formName: 'team_builder_login',
        //     formStatus: 'failed',
        //     email: email,
        //   }
        // );
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
}
