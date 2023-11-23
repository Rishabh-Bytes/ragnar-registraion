import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { TeamClassificationDataService } from 'src/app/shared/services/classification.service';
import {
  Registration,
  RegistrationConfigService,
} from 'src/app/shared/services/registration-config.service';
import { StateService } from 'src/app/shared/services/state.service';
import * as _ from 'lodash';
import {
  CustomFieldDataService,
  CustomFieldsGroupType,
} from 'src/app/shared/services/custom-field.service';
import { User } from 'src/app/shared/models/user.model';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import * as moment from 'moment';
import { Team } from 'src/app/shared/services/team.service';
export const HTTP_NOT_FOUND = 404;
export const HTTP_UNPROCESSABLE_ENTITY = 422;
@Component({
  selector: 'app-captain',
  templateUrl: './captain.component.html',
  styleUrls: ['./captain.component.scss'],
})
export class CaptainComponent implements OnInit, OnChanges {
  regConfigId: string = '';
  state: IRegistrationCaptainState;
  IS_CAPTAIN_ALREADY = false;
  error:
    | 'NOT_FOUND'
    | 'NOT_OPEN'
    | 'VIP_CLOSED'
    | 'UNEXPECTED'
    | 'IS_FULL'
    | 'IS_CAPTAIN_ALREADY'
    | 'LOADING' = 'LOADING';

  constructor(
    private route: ActivatedRoute,
    private RegistrationConfigDataService: RegistrationConfigService,
    private stateService: StateService,
    private TeamClassificationDataService: TeamClassificationDataService,
    private CustomFieldDataService: CustomFieldDataService,
    private authService: AuthService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('tes2t');
  }

  ngOnInit() {
    console.log('test');
    this.regConfigId = this.authService.getRedirectParams().params.regConfigId;
    let user = this.authService.getUser();
    let vipCode: any = this.authService.getVipCode();

    // TODO: Logic for the vip code and user
    this.state = this.stateService.getState('IRegistrationCaptainState');
    this.RegistrationConfigDataService.getRegistrations(
      this.regConfigId,
      undefined,
      undefined,
      undefined,
      user.email
    ).then(async (data: any) => {
      if (data && data.length > 0) {
        this.IS_CAPTAIN_ALREADY = true;
      }
      if (
        this.state === null ||
        this.state.regConfigId !== this.regConfigId ||
        !this.state.registrationData.classifications
      ) {
        await this.setState(this.regConfigId, user, vipCode);
        // this.$state.go(this.initialState).then(() => this.setTransitionListener());

        console.log(
          'this.get',
          this.stateService.getState('IRegistrationCaptainState')
        );
      } else {
        // this.error = null;
        // this.setTransitionListener();
      }
    });
  }

  setState(regConfigId: string, user: User, vipCode: string) {
    forkJoin([
      this.getClassifications(regConfigId),
      this.getRegistrationData(regConfigId, vipCode),
      this.getRegistrationConfig(regConfigId),
      this.getTeamPrices(regConfigId),
      // Add other observables as needed
    ]).subscribe(
      ([data1, data2, data3, data4]: any) => {
        console.log(
          '🚀 ~ file: captain.component.ts:156 ~ CaptainComponent ~ setState ~ data4:',
          data4
        );
        console.log(
          '🚀 ~ file: captain.component.ts:156 ~ CaptainComponent ~ setState ~ data3:',
          data3
        );
        console.log(
          '🚀 ~ file: captain.component.ts:156 ~ CaptainComponent ~ setState ~ data2:',
          data2
        );
        console.log(
          '🚀 ~ file: captain.component.ts:156 ~ CaptainComponent ~ setState ~ data1:',
          data1
        );
        // Handle data from API 1

        let open = !!(data2.open && data2.types && data2.types.length);
        let is_full = !!(data2.is_full && data2.types && data2.types.length);

        // this.error = null;
        //if (data[2].type == "TRAIL") {
        var index = data2.types.indexOf('SIX_PACK');
        if (index > -1) {
          data2.types.splice(index, 1);
        }
        //}

        data2.classifications = data1;
        if (user && user.bornAt) {
          let date = moment(user.bornAt);
          if (date.isValid()) {
            // user.bornAt = date.utc().format('MM/DD/YYYY');
            user.bornAt = date.format('MM/DD/YYYY');
          }
        }

        this.state = this.stateService.setState('IRegistrationCaptainState', {
          user: user,
          regConfigId: regConfigId,
          registrationData: data2,
          registrationConfig: data3,
          team: Team.fromJS({}),
          exemptions: 0,
          paidExemptions: 0,
          captain: Registration.fromJS({
            order: 1,
            extraFees: false,
            waiversSigned: true,
            waiversSnapshot: data3.funnel && data3.funnel.waiver,
            profilesId: user.id,

            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            bornAt: user.bornAt,
            gender: user.gender,
            address: user.address,
            phone: user.phone,
            pace: user.pace,
            tShirtSize: user.tShirtSize,
            address2: user.address2,
            country: user.country,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
          }),
          isVip: data2.isVip,
          vipCode: vipCode,
          waiversChecked: false,
          teamPrices: data4,
        });

        if (is_full) {
          this.error = 'IS_FULL';
        }
        if (!open) {
          this.error = 'NOT_OPEN';
        }
        if (this.IS_CAPTAIN_ALREADY) {
          this.error = 'IS_CAPTAIN_ALREADY';
        }

        this.state = this.stateService.getState('IRegistrationCaptainState');
        // console.log('tetststsad', this.stateService.getState('IRegistrationCaptainState'))

        // Add handling for other API responses as needed
      },
      (error) => {
        this.error = 'UNEXPECTED';

        if (error.status === HTTP_NOT_FOUND) {
          this.error = 'NOT_FOUND';
        }

        if (error.status === HTTP_UNPROCESSABLE_ENTITY) {
          if (error.response === '"VIP STAGE INVALID"') {
            this.error = 'VIP_CLOSED';
          } else {
            this.error = error.response;
          }
        }
      }
    );
  }

  getClassifications(regConfigId: string) {
    return this.TeamClassificationDataService.getTeamClassifications(
      regConfigId
    );
  }

  getRegistrationData(regConfigId: string, vipCode?: string) {
    return this.RegistrationConfigDataService.dataRegistrations(
      regConfigId,
      vipCode
    );
  }

  getRegistrationConfig(regConfigId: string) {
    return this.RegistrationConfigDataService.getRegistrationConfigById(
      regConfigId
    ).then((result: any) => {
      const forms = _.compact([
        _.get(result, 'funnel.form', null),
        _.get(result, 'funnel.confirmation', null),
        _.get(result, 'funnel.waiver[0]', null),
        _.get(result, 'funnel.waiver[1]', null),
      ]);

      return this.CustomFieldDataService.getCustomFieldsGroupByIds(forms).then(
        (data: any) => {
          result.funnel.form = _.find(
            data,
            (f) => f.type === CustomFieldsGroupType.Form
          );
          result.funnel.confirmation = [
            _.find(data, (f) => f.type === CustomFieldsGroupType.Confirmation),
          ];
          result.funnel.waiver[0] = _.find(
            data,
            (f) => f.type === CustomFieldsGroupType.Waiver && !f.appliesToMinors
          );
          result.funnel.waiver[1] = _.find(
            data,
            (f) => f.type === CustomFieldsGroupType.Waiver && f.appliesToMinors
          );
          return result;
        }
      );
    });
  }

  getTeamPrices(regConfigId: string) {
    return this.RegistrationConfigDataService.getTeamPrices(regConfigId);
  }
}
