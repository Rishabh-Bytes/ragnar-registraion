import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { RegistrationConfigService } from 'src/app/shared/services/registration-config.service';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-captain',
  templateUrl: './captain.component.html',
  styleUrls: ['./captain.component.scss']
})
export class CaptainComponent {
 
  regConfigId: string = '';
  private state: IRegistrationCaptainState;
  constructor(private route: ActivatedRoute,private RegistrationConfigDataService: RegistrationConfigService, private stateService: StateService) {}

  ngOnInit() {
    this.regConfigId = this.route.snapshot.params['eventId'];

    // TODO: Logic for the vip code and user
    this.state = this.stateService.getState('IRegistrationCaptainState');
    
  }
}
