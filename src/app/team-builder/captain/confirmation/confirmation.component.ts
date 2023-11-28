import { Component, OnInit } from '@angular/core';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { GoogleAnalytics } from 'src/app/shared/services/google-analytics.service';
import { StateService } from 'src/app/shared/services/state.service';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  state: IRegistrationCaptainState;
  UtilsService: UtilsService;
  dataLayer: any;
  constructor(
    private StateService: StateService,
    private GoogleAnalytics: GoogleAnalytics
  ) {}

  ngOnInit() {
    // this.dataLayer.push({ event: 'order_complete' });
    this.state = this.StateService.getState('IRegistrationCaptainState');
    console.log('this.state.....', this.state);

    this.GoogleAnalytics.sendingPageInitToGoogleAnalytics(
      'captain-confirmation',
      this.state?.captain ? this.state.captain.email! : '',
      'captain-confirmation'
    );
    this.StateService.clear('IRegistrationCaptainState');
  }
}
