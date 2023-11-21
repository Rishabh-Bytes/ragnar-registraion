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
  ) { }
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
                debugger
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
                  url
                ) {
                  this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
                    this.router.navigate([this.authService.getRedirectParams().stateName]);
                  });
                  // this.router.navigate([this.authService.getRedirectParams().stateName]);
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
