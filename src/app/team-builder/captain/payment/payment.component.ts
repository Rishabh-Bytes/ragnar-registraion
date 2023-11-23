import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AGE_OF_MAJORITY } from 'src/app/shared/constants/local-storage.const';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ICardData } from 'src/app/shared/services/authorize-net.service';
import { CountryService, ICountry, ICountryState } from 'src/app/shared/services/country.service';
import { CustomFieldsGroup } from 'src/app/shared/services/custom-field.service';
import { GoogleAnalytics } from 'src/app/shared/services/google-analytics.service';
import { PopUpService } from 'src/app/shared/services/pop-up.service';
import { OrderPrice, Payment, Registration, RegistrationConfigService } from 'src/app/shared/services/registration-config.service';
import { StateService } from 'src/app/shared/services/state.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  // @Input() state: IRegistrationCaptainState;
  @ViewChild('form', { static: true }) form!: NgForm;
  state: IRegistrationCaptainState;
  inputFocusCount = 0;
  affirmMinimumAmount: number = 250;
  showLoading: boolean;
  initialPriceInfo: OrderPrice;
  showButton: string = '';
  countries: ICountry[]
  states: ICountryState[]
  member: Registration;
  registration: Registration
  svgVisa: string
  svgMastercard: string
  svgDiscover: string
  waivers: CustomFieldsGroup[] | any
  cardData: ICardData
   cardType: string | null ;
  constructor(private stateService: StateService,
    private GoogleAnalytics: GoogleAnalytics,
    private RegistrationConfigDataService: RegistrationConfigService,
    private popUpService: PopUpService,
    private CountryService: CountryService,
    private AuthService: AuthService
  ) { }

  ngOnInit() {
    this.state = this.stateService.getState('IRegistrationCaptainState');
    this.showButton = 'card';
    this.getCountries();
    this.svgVisa = "images/visa-filled.svg";
    this.svgMastercard = "images/mastercard-filled.svg";
    this.svgDiscover = "images/discover-filled.svg";
    if (this.state.captain)
      // this.GoogleAnalytics.sendingPageInitToGoogleAnalytics('captain-payment', this.state.captain ? this.state.captain.email : '', 'captain-payment');
      if (this.state.price) {
        this.initialPriceInfo = _.cloneDeep(this.state.price);
      }
    this.member = this.stateService.getState('member');

    this.setWaivers();
    this.GoogleAnalytics.sendingGoogleAnalyticsData('CHECKOUT_PAYMENT', {
      id: this.state.regConfigId,
      name: this.state.registrationConfig.name,
      category: this.state.registrationConfig.type,
      price: this.state?.price?.total.toString(),
      quantity: 1
    });
    this.GoogleAnalytics.sendingEcommersEventToGoogleAnalytics('ADD_SHIPPING_INFO', {
      item_name: this.state.registrationConfig.name,
      item_id: this.state.registrationConfig.id,
      price: this.state?.price?.total.toString(),
      item_category: this.state.registrationConfig.type,
      item_category2: '',
      item_category3: '',
      item_category4: '',
      item_variant: (this.state.team.type === 'REGULAR') ? 'STANDARD' : this.state.team.type,
      quantity: '1',
    },
      //  {
      //     currency: 'USD',
      //     value: +(this.state.price.total + this.state.price.taxes),
      //     tax: +(this.state.price.taxes),
      //     shipping: 0,
      //     affiliation: 'Ragnar',
      //     transaction_id: '',
      //     coupon: this.state.promoCode || '',
      // }
    );
    console.log('State Data...', this.state);
  }

  formElementEnter(form: any) {
    if (form) {
      this.inputFocusCount++;
      if (this.inputFocusCount === 1) {
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_ENTER', {
          formName: 'promocode',
          ...form,
        })
      }
    }
  }

  formElementExit(form: any) {
    if (form) {
      this.inputFocusCount = 0;
      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_ELEMENT_EXIT', {
        formName: 'promocode',
        ...form
      })
    }
  }

  getPrice() {
    if (this.state.promoCode) {
      this.state.promoCode = this.state.promoCode.toUpperCase();
    }
    return this.RegistrationConfigDataService.postOrderPrice(this.state.regConfigId, Payment.fromJS({
      eventType: this.state.team.type,
      teamType: this.state.team.type,
      couponCode: this.state.promoCode,
      vipCode: this.state.vipCode
    })).then((price: any) => {
      if (this.state.promoCode && price.discounts === 0) {
        this.popUpService.openSnackBar('Sorry, this promo code is no longer valid.')
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
          messageType: 'Alert',
          messageContent: 'Sorry, this promo code is no longer valid.'
        })

        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
          formName: 'promocode',
          formStatus: 'failed',
          promoCode: this.state.promoCode
        })

      } else {
        if (this.state.promoCode == '') {
          this.popUpService.openSnackBar('Promo code removed Successfully.')
        } else {

          this.popUpService.openSnackBar('Promo code removed Successfully.')

          this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
            messageType: 'Success',
            messageContent: 'Promo code Applied Successfully.'
          })

          this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
            formName: 'promocode',
            formStatus: 'success',
            promoCode: this.state.promoCode
          })
        }
      }
      this.state.price = price;
      // this.showButton = (price.total > this.affirmMinimumAmount) ? '' : 'card';


      setTimeout(() => {
        this.calculateAffirmCents(price.total);

      })
      this.showLoading = false;
      return this.state.price;
    }).catch(() => {

      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
        messageType: 'Alert',
        messageContent: 'Promocode is not valid'
      })

      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
        formName: 'promocode',
        formStatus: 'failed',
        promoCode: this.state.promoCode
      })
      return this.state.price = _.cloneDeep(this.initialPriceInfo);
    })
  }

  calculateAffirmCents(price: any) {
    if (price >= this.affirmMinimumAmount) {
      price = (price * 100).toString();
      // document.getElementById('setAffirmPrice').setAttribute('data-amount', price);
      if (price) {
        // document.getElementById('affirmMonthlyPayment').setAttribute('data-amount', price);
        // affirm.ui.refresh();
      }
    }
  }

  getCountries() {
    return this.CountryService.getCountries().then((countries: any) => {
      this.countries = countries;
      const checkLoginType = this.AuthService.getRedirectParams();
      if (checkLoginType.params['loginType'] != "groupVolunteer") {
        this.getRegistration(this.state.captain.profilesId);
      }
      return this.countries;
    });
  }

  getRegistration(profileId: any) {
    return this.RegistrationConfigDataService.getByProfileId(profileId).then((registration: any) => {
      if (!_.isEmpty(registration)) {
        this.member = registration;
        let date = moment(this.member.bornAt);
        if (date.isValid()) {
          this.member.bornAt = date.format('MM/DD/YYYY');
          // this.member.bornAt = date.utc().format('MM/DD/YYYY');
        }
        if (this.member.phone) {
          this.formatPhoneNumber(this.member.phone, null);
        }
        let country = _.find(this.countries, (country) => country.value === this.member.country);
        this.stateService.setState('country', country);
        if (this.stateService.getState('country')) {
          this.getUserState();
        }
        this.stateService.setState('member', this.member);
      }
      this.onCountryChange(true);
      return this.registration = registration;
    });
  }

  onCountryChange(isFirstRequest: any) {
    let country = _.find(this.countries, (country) => country.value === this.state.captain.country);
    if (country) {
      this.stateService.setState('country', country);

      if (!isFirstRequest) { this.state.captain.state = undefined; }

      return this.CountryService.getStates(country).then((states: any) => {
        this.stateService.setState('member', this.member);
        return this.states = states;
      });
    } else {
      return null
    }
  }

  getUserState() {
    return this.CountryService.getStates(this.stateService.getState('country')).then((states: any) => {
      return this.states = states;
    });
  }

  formatPhoneNumber(s: any, member: any) {
    let s2 = ("" + s).replace(/\D/gm, '');
    let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    this.member.phone = (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];

    if (member) {
      this.formElementExit(member)
    }
  }

  setWaivers(): void {
    let isMinor = moment().diff(this.state.captain.bornAt, 'years') < AGE_OF_MAJORITY,
      waivers = this.state.registrationConfig?.funnel?.waiver;

    // TODO: remove when we implement minor waiver 
    if (waivers) {
      this.waivers = [waivers[0]];
    }
    this.state.captain.waiversSnapshot = this.waivers;

    // TODO: uncomment when we implement minor waiver 
    // if (isMinor) {
    //     // this.waivers = [waivers[0]];
    //     // let minor = waivers.filter((waiver) => waiver.appliesToMinors);
    //     // if (minor.length > 0) {
    //     //     this.waivers[1] = minor[0];
    //     // }
    //     // this.state.captain.waiversSnapshot = this.waivers;
    // } else {
    //     this.waivers = [waivers[0]];
    //     // this.waivers = waivers.filter((waiver) => !waiver.appliesToMinors);
    //     this.state.captain.waiversSnapshot = this.waivers;
    // }
  }

  clearPromoCode() {
    if (this.state.promoCode == '') {

      this.showLoading = true;
      this.popUpService.openSnackBar('Removing promo code.')
      this.getPrice();
    }

  }


  crediCardFormatter(value:any) {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || ''
    let parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
        return parts.join(' ')
    } else {
        return value
    }
}

validateCC(number:any) {
    if (number) {
        number = number.replace(/\s+/g, '');
        this.cardData.cardNumber = this.crediCardFormatter(number);
        // visa
        let re = new RegExp('^4');
        if (number.match(re) !== null) {
            this.svgVisa = "images/visa.svg";
            this.cardType = 'visa';
            // this.form.ccCardNumber.$setValidity('cardCheck', true);
            return;
        }
        // Mastercard
        if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) {
            this.svgMastercard = "images/mastercard.svg";
            this.cardType = 'master';
            // this.form.ccCardNumber.$setValidity('cardCheck', true);
            return;
        }
        // Discover
        re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
        if (number.match(re) !== null) {
            this.svgDiscover = "images/discover.svg";
            this.cardType = 'discover';
            // this.form.ccCardNumber.$setValidity('cardCheck', true);
            return;
        }
        // Amex Card Not supported.
        re = new RegExp('^3[47][0-9]{13}$');
        if (number.match(re) !== null) {
            this.svgVisa = "images/visa-filled.svg";
            this.svgMastercard = "images/mastercard-filled.svg";
            this.svgDiscover = "images/discover-filled.svg";
            this.cardType = null;
            // this.form.ccCardNumber.$setValidity('cardCheck', false);
            return;
        }
    } else {
        this.cardType = null;
    }
    this.svgVisa = "images/visa-filled.svg";
    this.svgMastercard = "images/mastercard-filled.svg";
    this.svgDiscover = "images/discover-filled.svg";
}

// showWaiver(title:any, body:any, isMinor:any) {
//     let top:any = null, height:any = null;
//     let ctrl = this;
//     if (ctrl.BrowserDetectionService.isMobile()) { top = $(window).scrollTop(); height = $(window).height(); }

//     let printBtn = '<md-dialog-actions>' +
//         '<md-button ng-click="$ctrl.cancel()" class="button-outline text-uppercase"><span> Cancel </span></md-button>' +
//         '<md-button ng-click="$ctrl.print()" class="md-accent md-raised md-button text-uppercase"><span> Print </span></md-button>' +
//         '</md-dialog-actions>';

//     this.$mdDialog.show({
//         parent: angular.element(document.body),
//         clickOutsideToClose: true,
//         escapeToClose: true,
//         multiple: false,
//         onComplete: function () {
//             if (ctrl.BrowserDetectionService.isMobile()) {
//                 $(".md-dialog-container").css('top', top + 'px');
//                 $(".md-dialog-container").css('height', height + 'px');
//             }
//         },
//         template:
//             '<md-dialog md-theme="default" ng-class="dialog.css">' +
//             '   <md-dialog-content id="printContents" class="md-dialog-content" role="document" tabIndex="-1">' +
//             '       <div class="close-button-container" style="text-align: right;">' +
//             '           <h2 class="md-title" style="float: left;">' + title + '</h2>' +
//             '           <md-button type="button" ng-click="$ctrl.cancel()"><md-icon>clear</md-icon></md-button>' +
//             '       </div>' +
//             '       <div class="md-dialog-content-body">' +
//             '           <div>' + body + '</div>' +
//             '       </div>' +
//             '   </md-dialog-content>'
//             + ((isMinor) ? printBtn : '') +
//             '</md-dialog>',
//         controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
//             $scope.$ctrl = {
//                 cancel: () => $mdDialog.cancel(),
//                 print: () => {
//                     var popupWin = window.open('', '_blank', 'width=600, height=500');
//                     popupWin.document.open();
//                     popupWin.document.write('<html><body onload="window.print()"><h2>' + title + '</h2><div>' + body + '</div></body></html>');
//                     popupWin.document.close();
//                 },
//             };
//         }]
//     });
// }
}
