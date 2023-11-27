import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AGE_OF_MAJORITY } from 'src/app/shared/constants/local-storage.const';
import { IRegistrationCaptainState } from 'src/app/shared/helper/interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthorizeNetService } from 'src/app/shared/services/authorize-net.service';
import {
  CountryService,
  ICountry,
  ICountryState,
} from 'src/app/shared/services/country.service';
import { CustomFieldsGroup } from 'src/app/shared/services/custom-field.service';
import { DateService } from 'src/app/shared/services/date.service';
import { GoogleAnalytics } from 'src/app/shared/services/google-analytics.service';
import { PopUpService } from 'src/app/shared/services/pop-up.service';
import {
  IOPaqueData,
  Order,
  OrderPrice,
  Payment,
  PostAffirmOrder,
  PreAffirmOrder,
  Registration,
  RegistrationConfigService,
} from 'src/app/shared/services/registration-config.service';
import { HTTP_UNPROCESSABLE_ENTITY } from 'src/app/shared/services/request.service';
import { StateService } from 'src/app/shared/services/state.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
declare let affirm:any;

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
  countries: ICountry[];
  states: ICountryState[];
  member: Registration;
  registration: Registration;
  svgVisa: string;
  svgMastercard: string;
  svgDiscover: string;
  waivers: CustomFieldsGroup[] | any;
  cardData: any = {
    name: '',
    cardNumber: '',
    month: '',
    year: '',
    cardCode: '',
    zip: '',
    expiration: ''
  };
  name: string;
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
  zip?: string;
  expiration: string;
  cardType: string | null;
  constructor(
    private stateService: StateService,
    private GoogleAnalytics: GoogleAnalytics,
    private RegistrationConfigDataService: RegistrationConfigService,
    private popUpService: PopUpService,
    private CountryService: CountryService,
    private AuthService: AuthService,
    private UtilsService: UtilsService,
    private DateService: DateService,
    private AuthorizeNetService: AuthorizeNetService,
  ) {}

  ngOnInit() {
    this.state = this.stateService.getState('IRegistrationCaptainState');
    this.showButton = 'card';
    this.getCountries();
    this.svgVisa = 'images/visa-filled.svg';
    this.svgMastercard = 'images/mastercard-filled.svg';
    this.svgDiscover = 'images/discover-filled.svg';
    if (this.state.captain)
      if (this.state.price) {
        // this.GoogleAnalytics.sendingPageInitToGoogleAnalytics('captain-payment', this.state.captain ? this.state.captain.email : '', 'captain-payment');
        this.initialPriceInfo = _.cloneDeep(this.state.price);
      }
    this.member = this.stateService.getState('member');

    this.setWaivers();
    this.GoogleAnalytics.sendingGoogleAnalyticsData('CHECKOUT_PAYMENT', {
      id: this.state.regConfigId,
      name: this.state.registrationConfig.name,
      category: this.state.registrationConfig.type,
      price: this.state?.price?.total.toString(),
      quantity: 1,
    });
    this.GoogleAnalytics.sendingEcommersEventToGoogleAnalytics(
      'ADD_SHIPPING_INFO',
      {
        item_name: this.state.registrationConfig.name,
        item_id: this.state.registrationConfig.id,
        price: this.state?.price?.total.toString(),
        item_category: this.state.registrationConfig.type,
        item_category2: '',
        item_category3: '',
        item_category4: '',
        item_variant:
          this.state.team.type === 'REGULAR'
            ? 'STANDARD'
            : this.state.team.type,
        quantity: '1',
      }

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

  getTrustedHtml (html: any)  {
    return this.UtilsService.getTrustedHtml(html);
  }

  formElementEnter(form: any) {
    if (form) {
      this.inputFocusCount++;
      if (this.inputFocusCount === 1) {
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
          'FORM_ELEMENT_ENTER',
          {
            formName: 'promocode',
            ...form,
          }
        );
      }
    }
  }

  formElementExit(form: any) {
    if (form) {
      this.inputFocusCount = 0;
      this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
        'FORM_ELEMENT_EXIT',
        {
          formName: 'promocode',
          ...form,
        }
      );
    }
  }

  getPrice() {
    if (this.state.promoCode) {
      this.state.promoCode = this.state.promoCode.toUpperCase();
    }
    return this.RegistrationConfigDataService.postOrderPrice(
      this.state.regConfigId,
      Payment.fromJS({
        eventType: this.state.team.type,
        teamType: this.state.team.type,
        couponCode: this.state.promoCode,
        vipCode: this.state.vipCode,
      })
    )
      .then((price: any) => {
        if (this.state.promoCode && price.discounts === 0) {
          this.popUpService.openSnackBar(
            'Sorry, this promo code is no longer valid.'
          );
          this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
            'SITE_MESSAGE',
            {
              messageType: 'Alert',
              messageContent: 'Sorry, this promo code is no longer valid.',
            }
          );

          this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
            'FORM_SUBMIT',
            {
              formName: 'promocode',
              formStatus: 'failed',
              promoCode: this.state.promoCode,
            }
          );
        } else {
          if (this.state.promoCode == '') {
            this.popUpService.openSnackBar('Promo code removed Successfully.');
          } else {
            this.popUpService.openSnackBar('Promo code removed Successfully.');

            this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
              'SITE_MESSAGE',
              {
                messageType: 'Success',
                messageContent: 'Promo code Applied Successfully.',
              }
            );

            this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
              'FORM_SUBMIT',
              {
                formName: 'promocode',
                formStatus: 'success',
                promoCode: this.state.promoCode,
              }
            );
          }
        }
        this.state.price = price;
        this.showButton = (price.total > this.affirmMinimumAmount) ? '' : 'card';

        setTimeout(() => {
          this.calculateAffirmCents(price.total);
        });
        this.showLoading = false;
        return this.state.price;
      })
      .catch(() => {
        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics(
          'SITE_MESSAGE',
          {
            messageType: 'Alert',
            messageContent: 'Promocode is not valid',
          }
        );

        this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
          formName: 'promocode',
          formStatus: 'failed',
          promoCode: this.state.promoCode,
        });
        return (this.state.price = _.cloneDeep(this.initialPriceInfo));
      });
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

  getRegistration(profileId: any) {
    return this.RegistrationConfigDataService.getByProfileId(profileId).then(
      (registration: any) => {
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
          let country = _.find(
            this.countries,
            (country) => country.value === this.member.country
          );
          this.stateService.setState('country', country);

          if (this.stateService.getState('country')) {
            this.getUserState();
          }
          this.stateService.setState('member', this.member);
        }
        this.onCountryChange(true);
        return (this.registration = registration);
      }
    );
  }

  getCountries() {
    return this.CountryService.getCountries().subscribe((countries: any) => {
      this.countries = countries;
      const checkLoginType = this.AuthService.getRedirectParams();
      if (checkLoginType.params['loginType'] != 'groupVolunteer') {
        this.getRegistration(this.state.captain.profilesId);
      }
      console.log('this.countries', this.countries);
      return this.countries;
    });
  }

  onCountryChange(isFirstRequest: any) {
    let country = _.find(
      this.countries,
      (country) => country.value === this.state.captain.country
    );
    if (country) {
      this.stateService.setState('country', country);

      if (!isFirstRequest) {
        this.state.captain.state = undefined;
      }

      return this.CountryService.getStates(country).subscribe((states: any) => {
        this.stateService.setState('member', this.member);
        return (this.states = states);
      });
    } else {
      return null;
    }
  }

  getUserState() {
    return this.CountryService.getStates(
      this.stateService.getState('country')
    ).subscribe((states: any) => {
      console.log('this.states', states);
      return (this.states = states);
    });
  }

  formatPhoneNumber(s: any, member: any) {
    let s2 = ('' + s).replace(/\D/gm, '');
    let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    this.member.phone = !m ? null : '(' + m[1] + ') ' + m[2] + '-' + m[3];

    if (member) {
      this.formElementExit(member);
    }
  }

  setWaivers(): void {
    let isMinor =
        moment().diff(this.state.captain.bornAt, 'years') < AGE_OF_MAJORITY,
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
      this.popUpService.openSnackBar('Removing promo code.');
      this.getPrice();
    }
  }

  crediCardFormatter(value: any) {
    let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = v.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }

  validateCC(number: any) {
    if (number) {
      number = number.replace(/\s+/g, '');
      this.cardNumber = this.crediCardFormatter(number);
      // visa
      let re = new RegExp('^4');
      if (number.match(re) !== null) {
        this.svgVisa = 'images/visa.svg';
        this.cardType = 'visa';
        // this.form.ccCardNumber.$setValidity('cardCheck', true);
        return;
      }
      // Mastercard
      if (
        /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
          number
        )
      ) {
        this.svgMastercard = 'images/mastercard.svg';
        this.cardType = 'master';
        // this.form.ccCardNumber.$setValidity('cardCheck', true);
        return;
      }
      // Discover
      re = new RegExp(
        '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)'
      );
      if (number.match(re) !== null) {
        this.svgDiscover = 'images/discover.svg';
        this.cardType = 'discover';
        // this.form.ccCardNumber.$setValidity('cardCheck', true);
        return;
      }
      // Amex Card Not supported.
      re = new RegExp('^3[47][0-9]{13}$');
      if (number.match(re) !== null) {
        this.svgVisa = 'images/visa-filled.svg';
        this.svgMastercard = 'images/mastercard-filled.svg';
        this.svgDiscover = 'images/discover-filled.svg';
        this.cardType = null;
        // this.form.ccCardNumber.$setValidity('cardCheck', false);
        return;
      }
    } else {
      this.cardType = null;
    }
    this.svgVisa = 'images/visa-filled.svg';
    this.svgMastercard = 'images/mastercard-filled.svg';
    this.svgDiscover = 'images/discover-filled.svg';
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

  test(form: FormGroup) {
    console.log('fomr', form);
  }

  selectCard(type: any) {
    this.showButton = type;
  }

    generateTeamNameRandom(capFirstName: any, capLastName: any) {
            return capFirstName.split(" ")[0] + ' ' + capLastName.split(" ")[0] + "'s Team";
        }


  affirmCheckoutProcess() {
    this.showLoading = true;
    if (!this.state.team.name) {
        this.state.team.name = this.generateTeamNameRandom(this.state?.captain?.firstName, this.state.captain.lastName);
    }
    if (!this.state.team.registrationPeriod) {
        this.state.team.registrationPeriod = this.state?.price?.stage;
    }
    if (this.state.promoCode) {
        this.state.promoCode = this.state.promoCode.toUpperCase();
    }
    let order = PreAffirmOrder.fromJS({
        captainData: _.cloneDeep(this.state.captain),
        teamData: _.cloneDeep(this.state.team),
        payment: Payment.fromJS({
            eventType: this.state.team.type,
            teamType: this.state.team.type,
            couponCode: this.state.promoCode,
            vipCode: this.state.vipCode,
            token: '',
            subTotalAmount: this.state?.price?.subTotal,
            discountAmount: this.state?.price?.discounts,
            serviceFeeAmount: this.state?.price?.fees,
            taxAmount: this.state?.price?.taxes,
            totalPrice: (this.state?.price?.subTotal ? this.state?.price?.subTotal : 0) + (this.state?.price?.fees? this.state?.price?.fees : 0) + (this.state?.price?.taxes? this.state?.price?.taxes : 0),
            paidPrice: this.state?.price?.total,
            stage: this.state?.price?.stage,
            cardNumber: (this.cardData && this.cardData.cardNumber) ? this.cardData.cardNumber.slice(-4) : ''
        })
    });

    this.GoogleAnalytics.sendingEcommersEventToGoogleAnalytics('ADD_PAYMENT_INFO', {
        item_name: this.state.registrationConfig.name,
        item_id: this.state.registrationConfig.id,
        price: this.state.price?.total.toString(),
        item_category: this.state.registrationConfig.type,
        item_category2: '',
        item_category3: '',
        item_category4: '',
        item_variant: (this.state.team.type === 'REGULAR') ? 'STANDARD' : this.state.team.type,
        quantity: '1',
    });

    this.RegistrationConfigDataService.createPreAffirmOrder(this.state.regConfigId, order)
        .then((data:any) => {
            data.orderData.reason = null;
            affirm.checkout({
                "merchant": {
                    "user_confirmation_url": "",
                    "user_cancel_url": "",
                    "user_confirmation_url_action": "POST",
                    "name": "Ragnar"
                },
                "shipping": {
                    "name": {
                        "first": this.state.captain.firstName,
                        "last": this.state.captain.lastName
                    },
                    "address": {
                        "line1": this.state.captain.address,
                        "city": this.state.captain.city,
                        "state": this.state.captain.state,
                        "zipcode": this.state.captain.zipCode,
                        "country": this.state.captain.country

                    },
                    "phone_number": this.state.captain.phone,
                    "email": this.state.captain.email
                },
                "billing": {
                    "name": {
                        "first": this.state.captain.firstName,
                        "last": this.state.captain.lastName
                    },
                    "address": {
                        "line1": this.state.captain.address,
                        "city": this.state.captain.city,
                        "state": this.state.captain.state,
                        "zipcode": this.state.captain.zipCode,
                        "country": this.state.captain.country

                    },
                    "phone_number": this.state.captain.phone,
                    "email": this.state.captain.email
                },
                "items": [{
                    "display_name": `${this.state.registrationConfig.raceYear} - ${this.state.registrationConfig.name} - ${this.state.team.type || ''} - Race Registration`,
                    "sku": this.state.registrationConfig.id,
                    "unit_price": Math.round((this.state?.price?.subTotal ? this.state?.price?.subTotal : 0) * 100),
                    "qty": 1,
                    "item_image_url": "",
                    "item_url": "",
                }],
                "metadata": {
                    "platform_type": "",
                    "shipping_type": "",
                    "mode": "modal",
                },
                "order_id": data.orderData.id,
                "shipping_amount": 0,
                "tax_amount": 0,
                "total": Math.round(data.orderData.paidAmount * 100)
            });

            affirm.checkout.open({
                onFail: (e:any) => {
                    this.showLoading = false;
                    data.orderData.reason = e.reason;
                    let order = PostAffirmOrder.fromJS({
                        orderData: data.orderData,
                    });
                    this.RegistrationConfigDataService.updatePostAffirmOrder(this.state.regConfigId, order)
                },
                onSuccess: (a:any) => {
                    var formData = [];
                    if (this.state?.registrationConfig?.funnel?.form) {
                        if (this.state.registrationConfig.funnel.form.customFields) {
                          const customFields = [...this.state.registrationConfig.funnel.form.customFields];
                          for (let i in customFields) {
                                formData.push({
                                    "customKey": customFields[i].fieldLabel,
                                    "customValue": customFields[i].answer || ''
                                });
                            }
                        }
                    }
                    let order = PostAffirmOrder.fromJS({
                        checkout_token: a.checkout_token,
                        orderData: data.orderData,
                        captainData: this.state.captain,
                        teamData: this.state.team,
                        formData: formData,
                        payment: Payment.fromJS({
                            eventType: this.state.team.type,
                            teamType: this.state.team.type,
                            couponCode: this.state.promoCode,
                            vipCode: this.state.vipCode,
                            token: '',
                            subTotalAmount: this.state?.price?.subTotal,
                            discountAmount: this.state?.price?.discounts,
                            serviceFeeAmount: this.state?.price?.fees,
                            taxAmount: this.state?.price?.taxes,
                            totalPrice: (this.state?.price?.subTotal ? this.state?.price?.subTotal : 0) + (this.state?.price?.fees? this.state?.price?.fees : 0) + (this.state?.price?.taxes? this.state?.price?.taxes : 0),
                            paidPrice: this.state?.price?.total,
                            stage: this.state?.price?.stage,
                            cardNumber: (this.cardData && this.cardData.cardNumber) ? this.cardData.cardNumber.slice(-4) : ''
                        })
                    });
                    if (order?.captainData?.bornAt) {
                        order.captainData.bornAt = this.DateService.getLocalISOTime(moment(order.captainData.bornAt).endOf('day').toDate());
                    }
                    this.RegistrationConfigDataService.updatePostAffirmOrder(this.state.regConfigId, order)
                        .then((orderResponse) => {
                            this.handleSuccessResponce(orderResponse, order);
                        })
                        .catch((error) => {
                            this.showLoading = false;
                            this.handleErrorResponce(error);
                        })
                }
            });
        })
        .catch(() => {
            this.showLoading = false;
        })

    affirm.ui.ready(
        () => {
            affirm.ui.error.on("close", () => {
                this.showLoading = false;
                // this.$rootScope.$apply();
            });
        }
    );
}

handleSuccessResponce(orderResponse:any, order:any) {
  this.state.order = orderResponse;
  if (this.state?.price?.total){
    this.state.price.total = orderResponse.paidAmount;
  }
  if (this.state.captain.bornAt) {
      this.state.captain.bornAt = this.DateService.getLocalISOTime(moment(this.state.captain.bornAt).endOf('day').toDate());
  }
  this.AuthService.updateUserInfo(this.state.captain);

  // this.GoogleAnalytics.sendingGoogleAnalyticsData('CHECKOUT_PAYMENT_DONE', {
  //     id: this.state.regConfigId,
  //     name: this.state.registrationConfig.name,
  //     category: this.state.registrationConfig.type,
  //     price: order.payment.subTotalAmount,
  //     quantity: 1
  // },
  //     {
  //         id: orderResponse.orderId,
  //         affiliation: 'Ragnar',
  //         revenue: order.payment.paidPrice,
  //         tax: order.payment.taxAmount,
  //         total_revenue: order.payment.paidPrice + order.payment.taxAmount,
  //         coupon: order.payment.couponCode || '',
  //         price: order.payment.subTotalAmount,
  //         name: this.state.registrationConfig.name,
  //         transactionId: orderResponse.transcationId
  //     });

  this.GoogleAnalytics.sendingEcommersEventToGoogleAnalytics('PURCHASE', {
      item_name: this.state.registrationConfig.name,
      item_id: this.state.registrationConfig.id,
      price: this.state.price?.total.toString(),
      item_category: this.state.registrationConfig.type,
      item_category2: '',
      item_category3: '',
      item_category4: '',
      item_variant: (this.state.team.type === 'REGULAR') ? 'STANDARD' : this.state.team.type,
      quantity: '1',
  },
      {
          currency: 'USD',
          value: order.payment.paidPrice + order.payment.taxAmount,
          tax: order.payment.taxAmount,
          shipping: 0,
          affiliation: 'Ragnar',
          transaction_id: orderResponse.transcationId,
          coupon: order.payment.couponCode || '',
      });

  // this.$state.go('team-builder.registration.captain.confirmation');

  //need to add confirmation page routing

  this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
      formName: 'captain_payment_card_info',
      formStatus: 'success',
  });

  this.addExpertVoicePixelScript(order);
  this.addNorthBeamConversionPixel(order);
}

handleErrorResponce(error:any) {
  let code = 'unknown',
      text = 'Unexpected error';

  this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('FORM_SUBMIT', {
      formName: 'captain_payment_card_info',
      formStatus: 'failed',
  })

  this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
      messageType: 'Alert',
      messageContent: error.errorMessage || ''
  })

  if (error.status === HTTP_UNPROCESSABLE_ENTITY) {
      let response = JSON.parse(error.response);

      if (response.errors && response.errors.error && response.errors.error[0]) {
          code = 'T0' + response.errors.error[0].errorCode;
          text = response.errors.error[0].errorText;
      }

      if (response.error && response.error[0]) {
          code = 'T1' + response.error[0].errorCode;
          text = response.error[0].errorText;
      }

      if (response.err) {
          code = 'ALREADY REGISTERED';
          text = response.err;
      }

      if (response.errorMessage) {
          code = '422';
          text = response.errorMessage;
      }
  }

  // return this.$q.reject([{
  //     code: code,
  //     text: text
  // }]);
}

addExpertVoicePixelScript(order:any) {
  const purchaseDetails:any = this.state;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  // script.src = 'your_script_url_here';
  script.innerHTML = `
          var _exp = window._exp || [];
          _exp.push({
          pixelId: 'exp-681-132736', //Pixel ID provided by EV
          orderId: '${purchaseDetails.order.orderId}',
          orderDiscountCode: '${order.payment.couponCode || ''}',     // Discount code used on order, or discount group name. Used to identify commissionable orders.
          orderDiscount: '${purchaseDetails.price.discounts}',
          orderShipping: '${purchaseDetails.price.fees}',
          orderSubtotal: '${purchaseDetails.price.subTotal}',     // Order subtotal. After discount is applied, before tax & shipping. Commission calculated from this.
          orderTax: '${order.payment.taxAmount}',
          orderCurrency: 'USD',
          orderTotal: '${purchaseDetails.price.total}',
          products: [
              {id: '${this.state.registrationConfig.id}', // parent SKU - Should match product code in EV store file 
              name: '${this.state.registrationConfig.name}',
              sku: '${this.state.registrationConfig.id}', 
              upc: '', 
              msrp: '${this.state.price?.total.toString()}',
              price: '${this.state.price?.total.toString()}', 
              quantity: '1'},
          ],
          });
          // **********     Invoking Pixel - Do not edit below this line.   **********

          (function(w, d) {
          function ls() {
              var e = d.createElement('script');
              e.src = 'https://plugins.experticity.com/oa/2/plugin.js';
              d.body.appendChild(e);
          }
          if (w.attachEvent) {
              w.attachEvent('onload', ls);
          } else {
              w.addEventListener('load', ls, false);
          }
          })(window, document);
  `;
  // angular.element(document.getElementsByTagName('head')[0]).append(script);
}

addNorthBeamConversionPixel(order:any){
  const purchaseDetails:any = this.state;
  let script = document.createElement('script');
  script.type = 'text/javascript';
  const data = {
      id: purchaseDetails.order.orderId, // A unique identifier for the order that was placed. Must be unique among all orders.
      totalPrice: purchaseDetails.price.total, // The total amount collected for the purchase.
      shippingPrice: purchaseDetails.price.fees, // Shipping fees charged to the customer for this purchase.
      taxPrice: order.payment.taxAmount, // Taxes charged to the customer for this purchase.
      coupons: order.payment.couponCode || '', // A comma separated list of discount codes used.
      currency: "USD", // A 3-character ISO currency code describing totalPrice, taxPrice, and shippingPrice.
      customerId: purchaseDetails.captain.profilesId, // A unique identifier for the customer who made a purchase.
      lineItems: [
        {
          productId: this.state.registrationConfig.id,
          variantId: this.state.team.type,
          productName: this.state.registrationConfig.name + "  " +this.state.registrationConfig.raceYear,
          variantName: this.state.team.type,
          price: order.payment.subTotalAmount,
          quantity: 1,
        }]
    };
  // window["Northbeam"].firePurchaseEvent(data)
}

next() {
  let result;
  if (this.state.price?.total === 0) {
      result = this.postOrder();
  } else {
      result = this.AuthorizeNetService.authorize(this.cardData)
      .then((opaqueData:any) => {
          return this.postOrder(opaqueData);
      });
  }

  return result.catch((error:any) => {
      if (error[0].code == "E00117") {
              this.popUpService.openSnackBar('Valid ZipCode Required')
          this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
              messageType: 'Alert',
              messageContent: 'Valid ZipCode Required'
          })
      } else if (error[0].code != "unknown") {
              this.popUpService.openSnackBar(error[0].text)

          this.GoogleAnalytics.sendingFormsEventToGoogleAnalytics('SITE_MESSAGE', {
              messageType: 'Alert',
              messageContent: error[0].text
          })
      }
  });
}

postOrder(opaqueData?: IOPaqueData) {
  // this.state.captain.state = this.state.captain.state.toUpperCase()
  if (!this.state.team.name) {
      this.state.team.name = this.generateTeamNameRandom(this.state.captain.firstName, this.state.captain.lastName);
  }
  if (!this.state.team.registrationPeriod) {
      this.state.team.registrationPeriod = this.state.price?.stage;
  }
  if (this.state.promoCode) {
      this.state.promoCode = this.state.promoCode.toUpperCase();
  }

  var formData = [];
  if (this.state.registrationConfig.funnel?.form) {
      if (this.state.registrationConfig.funnel.form.customFields) {
          // var customFields = angular.copy(this.state.registrationConfig.funnel.form.customFields);
          const customFields = [...this.state.registrationConfig.funnel.form.customFields];

          for (let i in customFields) {
              formData.push({
                  "customKey": customFields[i].fieldLabel,
                  "customValue": customFields[i].answer || ''
              });
          }
      }
  }
  let order = Order.fromJS({
      teamData: this.state.team,
      captainData: this.state.captain,
      formData: formData,
      payment: Payment.fromJS({
        eventType: this.state.team.type,
        teamType: this.state.team.type,
        couponCode: this.state.promoCode,
        vipCode: this.state.vipCode,
        token: opaqueData,
        subTotalAmount: this.state?.price?.subTotal,
        discountAmount: this.state?.price?.discounts,
        serviceFeeAmount: this.state?.price?.fees,
        taxAmount: this.state?.price?.taxes,
        totalPrice: (this.state?.price?.subTotal ? this.state?.price?.subTotal : 0) + (this.state?.price?.fees? this.state?.price?.fees : 0) + (this.state?.price?.taxes? this.state?.price?.taxes : 0),
        paidPrice: this.state?.price?.total,
        stage: this.state?.price?.stage,
        cardNumber: (this.cardData && this.cardData.cardNumber) ? this.cardData.cardNumber.slice(-4) : ''
    })
  });

  if (order.captainData.bornAt) {
      order.captainData.bornAt = this.DateService.getLocalISOTime(moment(order.captainData.bornAt).endOf('day').toDate());
  }

  return this.RegistrationConfigDataService.postOrder(this.state.regConfigId, order).then((orderResponse:any) => {
      this.GoogleAnalytics.sendingEcommersEventToGoogleAnalytics('ADD_PAYMENT_INFO', {
          item_name: this.state.registrationConfig.name,
          item_id: this.state.registrationConfig.id,
          price: this.state.price?.total.toString(),
          item_category: this.state.registrationConfig.type,
          item_category2: '',
          item_category3: '',
          item_category4: '',
          item_variant: (this.state.team.type === 'REGULAR') ? 'STANDARD' : this.state.team.type,
          quantity: '1',
      }, {
          currency: 'USD',
          value: +(order.payment.paidPrice + order.payment.taxAmount),
          tax: +(order.payment.taxAmount ? order.payment.taxAmount : 0),
          shipping: 0,
          affiliation: 'Ragnar',
          transaction_id: orderResponse.transcationId,
          coupon: order.payment.couponCode || '',
      });
      this.handleSuccessResponce(orderResponse, order);
  }).catch((error) => {
      this.handleErrorResponce(error);
  });
}

}
