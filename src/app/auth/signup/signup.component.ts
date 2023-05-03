import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PATTERNS, ROUTES } from 'src/app/shared/constants';

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
  constructor() {}
  ngOnInit(): void {}

  createAccount() {
    console.log('form', this.signupForm.value);
  }
}

// {
//   "firstName": "Nirav",
//   "lastName": "G",
//   "email": "nirav@mailinator.com",
//   "password": "Test@12345",
//   "bornAt": "03/11/1997",
//   "dateOfBirth": "1997-03-11T23:59:59.000Z"
// }
