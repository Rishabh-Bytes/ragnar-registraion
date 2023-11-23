import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Registration } from '../../services/registration-config.service';
import { IRegistrationCaptainState } from '../../helper/interface';
import { GoogleAnalytics } from '../../services/google-analytics.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  @Input() members: Registration;
  @Input() state: IRegistrationCaptainState
  inputFocusCount = 0;
  emailRegex: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  constructor(private GoogleAnalytics: GoogleAnalytics
  ) {

  }
  ngOnInit() {
    console.log("🚀 ~ file: form.component.ts:19 ~ FormComponent ~ ngOnInit ~ this.members:", this.members)
  }

  formElementEnter(form: any) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_ENTER', {
        formName: 'team_builder_registration_form',
        firtName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.bornAt,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        tShirtSize: form.tShirtSize,
        country: form.country,
        state: form.state,
        city: form.city,
        addressLine1: form.address,
        addressLine2: form.address2,
        zipCode: form.zipCode,
      })
    }
  }

  formElementExit(form: any) {
    this.inputFocusCount = 0;
    this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_EXIT', {
      formName: 'team_builder_registration_form',
      firtName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: form.bornAt,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      tShirtSize: form.tShirtSize,
      country: form.country,
      state: form.state,
      city: form.city,
      addressLine1: form.address,
      addressLine2: form.address2,
      zipCode: form.zipCode,
    })
  }

  formatPhoneNumber(s: any, member: any) {
    let s2 = ("" + s).replace(/\D/gm, '');
    let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    this.state.captain.phone = (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];

    if (member) {
      this.formElementExit(member)
    }
  }

}
