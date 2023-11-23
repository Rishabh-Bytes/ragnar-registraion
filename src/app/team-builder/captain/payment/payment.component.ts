import { Component, Input, OnInit } from '@angular/core';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { Registration } from 'src/app/shared/services/registration-config.service';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  // @Input() state: IRegistrationCaptainState;
  state: IRegistrationCaptainState;

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.state = this.stateService.getState('IRegistrationCaptainState');
    console.log('State Data...', this.state);
  }
}
