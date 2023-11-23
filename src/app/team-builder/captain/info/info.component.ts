import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { CategoryService } from 'src/app/shared/services/category.service';
import { DefaultPaceService } from 'src/app/shared/services/defaultpace.service';
import { GoogleAnalytics } from 'src/app/shared/services/google-analytics.service';
import { PopUpService } from 'src/app/shared/services/pop-up.service';
import {
  Payment,
  Registration,
  RegistrationConfigService,
} from 'src/app/shared/services/registration-config.service';

import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  member: any;
  state: IRegistrationCaptainState;
  @ViewChild('infoForm', { static: true }) infoForm!: NgForm;
  isNextClicked: boolean = false;
  maxDate: Date;
  allPaceValue: any = [];
  inputFocusCount = 0;
  standardTeam = 0;
  ultraTeam = 0;
  blackLoopTeam = 0;
  captainFields: FormlyFieldConfig[] = [
    {
      key: 'Teams',
      type: 'input',
      props: {
        label: 'Team Name',
        placeholder: 'Enter team name',
        required: true,
      },
    },
  ];
  constructor(
    private stateService: StateService,
    private DefaultPaceService: DefaultPaceService,
    private RegistrationConfigDataService: RegistrationConfigService,
    private CategoryService: CategoryService,
    private GoogleAnalytics: GoogleAnalytics,
    private popUpService: PopUpService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.state = this.stateService.getState('IRegistrationCaptainState');
    console.log(
      '🚀 ~ file: info.component.ts:33 ~ InfoComponent ~ ngOnInit ~  this.state:',
      this.state
    );
    this.member = this.state.captain;
    this.maxDate = new Date();
    let iscountryFoundinDynamo = [
      'US',
      'United States',
      'United States of America',
      'U.S.',
      'U.S.A.',
      'U.S.A',
      'United State',
      'Unites States',
      'United Stated',
      'U.S',
    ];
    let replce_to_USA = iscountryFoundinDynamo.indexOf(this.member.country);

    if (replce_to_USA > -1) {
      this.member.country = 'USA';
    }
    this.allPaceValue = this.DefaultPaceService.getPaces();

    if (this.state.registrationConfig.type === 'ROAD') {
      this.standardTeam = 12;
      this.ultraTeam = 6;
    } else if (this.state.registrationConfig.type === 'TRAIL') {
      this.standardTeam = 8;
      this.ultraTeam = 4;
      this.blackLoopTeam = 2;
    } else if (this.state.registrationConfig.type === 'SPRINT') {
      this.standardTeam = 6;
      this.ultraTeam = 3;
    } else if (this.state.registrationConfig.type === 'SUNSET') {
      this.standardTeam = 4;
      this.ultraTeam = 2;
    } else if (this.state.registrationConfig.type === 'TRAIL_SPRINT') {
      this.standardTeam = 3;
      this.ultraTeam = 2;
    }
    // console.log("🚀 ~ file: info.component.ts:35 ~ InfoComponent ~ ngOnInit ~  this.member:",  this.state.registrationConfig.funnel.form.customFields)

    // if (this.state.registrationConfig.funnel?.form.customFields.length > 0) {
    //   this.state.registrationConfig.funnel?.form.customFields.forEach((element:any) => {
    //     switch (element.fieldStyle){
    //       case "select":
    //         this.captainFields.push(
    //           {
    //             key: 'selectedItem',
    //             type: 'select',
    //             defaultValue: '--Select--',
    //             templateOptions: {
    //               label: element.fieldLabel,
    //               options: [
    //                 { label: 'Yes', value: 'yes' },
    //                 { label: 'No', value: 'no' },
    //               ],
    //             },
    //           },
    //         )
    //     }
    //   });
    // }
  }

  next() {
    this.isNextClicked = true;
    this.state.team.runnersMax = this.CategoryService.getCategoryRunnersMax(
      this.state.registrationConfig.type,
      this.state.team.type
    );
    if (this.state.team.name !== undefined && this.state.team.name.length > 0) {
      this.state.team.name = this.state.team.name;
    }

    this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
      formName: 'captain_info',
      formStatus: 'sucess',
      // firtName: this.form.firstName.$viewValue,
      // lastName: this.form.lastName.$viewValue,
      // email: this.form.email.$viewValue,
      // phone: this.form.phone.$viewValue,
    });

    if (!this.state.team.type) {
      this.popUpService.openSnackBar('Please select team type');
    }

    return this.getPrice()
      .then((price: any) => {
        this.state.price = price;
      })
      .then(() => {
        const stateName = this.authService.getRedirectParams().params.regConfigId;
        const newStateName = 'team-builder/' + stateName + '/registration/captain';
        console.log('StateName...', newStateName);
        this.router.navigate([newStateName + '/payment']);
        // return this.$state.go('team-builder.registration.captain.payment');
      });
  }

  selectType(type: any) {
    this.state.team.type = type;
  }

  getPrice() {
    return this.RegistrationConfigDataService.postOrderPrice(
      this.state.regConfigId,
      Payment.fromJS({
        eventType: this.state.team.type,
        teamType: this.state.team.type,
        vipCode: this.state.vipCode,
      })
    );
  }
  toPayment() {
    const stateName = this.authService.getRedirectParams().params.regConfigId;
    const newStateName = 'team-builder/' + stateName + '/registration/captain';
    console.log('StateName...', newStateName);
    this.router.navigate([newStateName + '/payment']);
  }

  formElementExit(form: any) {
    this.inputFocusCount = 0;
    this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_EXIT', {
        formName: 'team_builder_registration_form',
        ...this.getDataLayerFormObjWithoutModel(form),
    })
}

getDataLayerFormObjWithoutModel(form:any) {
  const formFields:any = {};
  Object.keys(form).forEach((key: any) => {
      if (!key.includes('$')) {
          formFields[key] = form[key] || '';
      }
  });
  return formFields;
}

formatPhoneNumber(s:any, member:any) {
  let s2 = ("" + s).replace(/\D/gm, '');
  let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  this.state.captain.phone = (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];

  if (member) {
      this.formElementExit(member)
  }
}
}
