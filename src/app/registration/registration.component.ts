import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationConfigService } from '../shared/services/registration-config.service';
import { ROUTES } from 'src/app/shared/constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  routes = ROUTES;
  currentRoute: string = '';
  eventId: string = '';
  loginType: string = '';
  type: string = '';
  constructor(private router: Router, private route: ActivatedRoute, private RegistrationConfigDataService: RegistrationConfigService) {
    
  }
  ngOnInit() {
    this.currentRoute = this.router.url;
    this.eventId = this.route.snapshot.params['eventId'];
    this.loginType = this.route.snapshot.params['loginType'];
    if (this.eventId) {
      this.RegistrationConfigDataService.getRegistrationConfigById(this.eventId).then((data: any) => {
        this.type = data.type;
        const redirectParams = {
          stateName: this.currentRoute,
          params: {
            type: this.type,
            loginType: this.loginType,
            regConfigId: this.eventId
          }
        };
        sessionStorage.setItem('redirect-params', JSON.stringify(redirectParams));
      })
    }
    
    const jwtToken = localStorage.getItem('jwtToken-user');

    if (!jwtToken) {
      this.router.navigate([this.routes.LOGIN]);
    }
  }
}
