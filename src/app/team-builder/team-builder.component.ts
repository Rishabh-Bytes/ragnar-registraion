import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { RegistrationConfigService } from '../shared/services/registration-config.service';
import { StateService } from '../shared/services/state.service';
import {
  IRegistrationCaptainState,
  RegistrationConfig,
} from '../shared/helper/interface';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';

import { capitalize } from 'lodash';
import * as _ from 'lodash';
import { state } from '@angular/animations';

@Component({
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.scss'],
})
export class TeamBuilderComponent implements OnInit {
  regConfigId: string = '';
  private state: IRegistrationCaptainState;
  private user: User;
  captain: any;
  constructor(
    private route: ActivatedRoute,
    private RegistrationConfigDataService: RegistrationConfigService,
    private stateService: StateService,
    private router: Router,
    private authService: AuthService
  ) {}
  async ngOnInit() {
    this.regConfigId = this.route.snapshot.params['eventId'];

    switch (true) {
      case window.location.href.includes('captain'):
        // let captain: string;
        await this.route.queryParams.subscribe((params) => {
          this.captain = params['captain'];
        });

        console.log('captain', this.captain);

        if (this.captain) {
          if (!_.isError(_.attempt(JSON.parse, atob(this.captain)))) {
            this.RegistrationConfigDataService.getRegistrationConfigById(
              this.regConfigId
            ).then(
              (registrationConfig: any) => {
                const url = this.router.url.split('?')[0];
                console.log('before ? ', url);
                this.authService.setRedirectParams(url, {
                  type: registrationConfig.type,
                  loginType: 'captain',
                  regConfigId: this.regConfigId,
                });
                this.captain = JSON.parse(atob(this.captain));
                localStorage.setItem('jwtToken-user', this.captain.jwtToken);
                delete this.captain.jwatToken;
                this.authService.setUser(this.captain);
                delete this.captain;
                this.state = this.authService.getRedirectParams();
                console.log('getState', this.state);

                if (
                  this.authService.getRedirectParams().stateName ===
                  '/team-builder/ruH256_K-/registration/captain/info'
                ) {
                  this.router.navigate(['captain']);
                } else {
                }
              },
              () => {
                this.checkUser('captain');
              }
            );
          } else {
            this.checkUser('captain');
          }
        } else {
          this.checkUser('captain');
        }
        // this.checkUser('captain');
        // If the URL contains "captain", navigate to the captain route
        // this.router.navigate(['captain']);
        break;
      case window.location.href.includes('runner'):
        this.checkUser('runner');
        // If the URL contains "runner", navigate to the runner route
        this.router.navigate(['runner']);
        break;
      default:
        // Handle other cases here or provide a default route
        break;
    }
  }

  //   $onInit() {
  //     let captain = this.$stateParams.captain;
  //     console.log("🚀  file: registration.component.ts:18  Controller  $onInit  captain:", captain)
  //     // this.GoogleAnalytics.sendingPageInitToGoogleAnalytics('registration',this.user ? this.user.email : "", 'registration');
  //     / Note: Captain automate Login Code /
  //     if (captain) {
  //         captain = decodeURIComponent(this.$stateParams.captain)
  //         console.log("🚀  file: registration.component.ts:23  Controller  $onInit  captain:", captain)
  //         if (!_.isError(_.attempt(JSON.parse, atob(captain)))) {
  //             this.RegistrationConfigDataService.getRegistrationConfigById(this.$stateParams.regConfigId).then((registrationConfig: Data.RegistrationConfig) => {
  //                 this.AuthService.setRedirectParams(this.$state.current.name, { "type": registrationConfig.type });

  //                 captain = JSON.parse(atob(captain));
  //                 localStorage.setItem('jwtToken-user', captain.jwtToken);
  //                 delete captain.jwtToken;
  //                 this.AuthService.setUser(captain);
  //                 delete this.$stateParams.captain;
  //                 if (this.$state.current.name === 'team-builder.registration.captain.info') {
  //                     this.$state.transitionTo('team-builder.registration.captain.info', this.$stateParams, { reload: true, inherit: false, notify: true });
  //                 } else {
  //                     this.$state.transitionTo('team-builder.registration.volunteer.info', this.$stateParams, { reload: true, inherit: false, notify: true });
  //                 }
  //             }, () => {
  //                 this.checkUser();
  //             });
  //         } else {
  //             this.checkUser();
  //         }
  //         / Note: Captain automate Login Code /
  //     } else {
  //         this.checkUser();
  //     }
  // }

  checkUser(type: string) {
    this.user = this.authService.getUser();

    if (!this.user) {
      if (this.regConfigId) {
        this.RegistrationConfigDataService.getRegistrationConfigById(
          this.regConfigId
        ).then((registrationConfig: any) => {
          // TODO: Need to check if we getting the token from url parameter then captain would be logged in automatically.
          if (type === 'captain') {
            // Logics for the captain login goes here
            const url = this.router.url.split('?')[0];
            this.authService.setRedirectParams(url, {
              type: registrationConfig.type,
              loginType: type,
              regConfigId: this.regConfigId,
            });
            this.router.navigate(['login']);
          } else {
            this.checkUser(type);
          }
        });
      } else {
        this.router.navigate(['login']);
      }
    }
  }
}
