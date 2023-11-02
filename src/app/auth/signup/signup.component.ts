import { PopUpService } from './../../shared/services/pop-up.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { PATTERNS, ROUTES } from 'src/app/shared/constants';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DateService } from 'src/app/shared/services/date.service';
import { GoogleAnalytics } from 'src/app/shared/services/google-analytics.service';
export type EventType = 'ROAD' | 'TRAIL' | 'SPRINT' | 'SUNSET' | 'TRAIL_SPRINT';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    bornAt: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(PATTERNS.EMAIL),
    ]),
    password: new FormControl('', [Validators.required]),
  });
  routes = ROUTES;
  formSubmitted: boolean = false;
  eventType: EventType = 'TRAIL';
  loginType: string = '';
  eventId: string = '';
  redirectParams: any;
  constructor(private DateService: DateService,
    private AuthService: AuthService,
    private GoogleAnalytics: GoogleAnalytics,
    private PopUpService: PopUpService,
    private router: Router,
    ) { }
  ngOnInit(): void {
    const params = sessionStorage.getItem('redirect-params');
    if (params) {
      this.loginType = JSON.parse(params).params.loginType;
      this.eventType = JSON.parse(params).params.type;
      this.eventId = JSON.parse(params).params.regConfigId;
      this.redirectParams = JSON.parse(params);
    }
   }

  createAccount() {
    console.log('form', this.signupForm.value);
    let errorMessage;
    let userType = 'User';
    this.signupForm.value.email = this.signupForm.value.email.toLowerCase();
    if (this.signupForm.value.bornAt) {
      this.signupForm.value.dateOfBirth = this.DateService.getLocalISOTime(moment(this.signupForm.value.bornAt).endOf('day').toDate());
    }
    return this.AuthService.createUser(this.signupForm.value).then((user: any) => {

      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
        formName: 'team_builder_create_account',
        formStatus: 'success',
        firtName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        dateOfBirth: this.signupForm.value.dateOfBirth,
        email: this.signupForm.value.email,
      })

      return this.AuthService.login(this.signupForm.value, userType).subscribe((user: any) => {
        const params = sessionStorage.getItem('redirect-params');
        localStorage.setItem('jwtToken-user', user.jwtToken);
        this.AuthService.setUser(user);
        this.AuthService.updateProfileId(user.emailAddress, user.id).then((isUpdated: any) => {
        });
        const redirectUrl = 'team-builder/'+this.eventId + '/registration/' +  this.loginType
        this.router.navigate([redirectUrl]);
        // return this.$state.go(params.stateName, angular.extend({}, params.params));
      });
    }).catch((error: any) => {
      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
        formName: 'team_builder_create_account',
        formStatus: 'failed',
        firtName: this.signupForm.value.firstName,
        lastName: this.signupForm.value.lastName,
        dateOfBirth: this.signupForm.value.dateOfBirth,
        email: this.signupForm.value.email,
      })
      errorMessage = error.error.message;
      if (error.error.code === 'InvalidParameterException') {
        errorMessage = "Password should not contain space on start and end";
        // error.data.message.match(regEx)[1];
      }

      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
        messageType: 'Alert',
        messageContent: errorMessage
      })

      this.PopUpService.openSnackBar(errorMessage)
      return null;
    });
  }

  initForm() { }
}


// {
//   "firstName": "Nirav",
//   "lastName": "G",
//   "email": "nirav@mailinator.com",
//   "password": "Test@12345",
//   "bornAt": "03/11/1997",
//   "dateOfBirth": "1997-03-11T23:59:59.000Z"
// }
