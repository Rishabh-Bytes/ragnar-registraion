import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { Registration } from 'src/app/shared/services/registration-config.service';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit{

  member: any
  state: IRegistrationCaptainState
 
  captainFields: FormlyFieldConfig[] =[
    {
      key: 'Teams',
      type: 'input',
      props: {
        label: 'Team Name',
        placeholder: 'Enter team name',
        required: true,
      },
    }
  ]
  constructor(private stateService: StateService) {
    
  }
  ngOnInit() {
    this.state = this.stateService.getState('IRegistrationCaptainState');
    console.log("🚀 ~ file: info.component.ts:33 ~ InfoComponent ~ ngOnInit ~  this.state:",  this.state)
    this.member = this.state.captain;
    console.log("🚀 ~ file: info.component.ts:35 ~ InfoComponent ~ ngOnInit ~  this.member:",  this.member)
  }
}
