import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';


export interface GAnalyticsProduct {
    id: string;
    name?: string;
    category?: string;
    brand?: string;
    variant?: string;
    price?: string;
    quantity?: number;
    affiliation?: string;
    revenue?: string;
    tax?: string,
    coupon?: string,
    transactionId?: string;
    total_revenue?: string;
}

export interface GAnalyticsProductForEcommerce {
    item_name: string,  // race name
    item_id: string,      //race ID
    price?: string,            //race price
    item_brand?: string,     // we can use runragnar, or any other specification
    item_category?: string,   // we can use this for race type for example
    item_category2?: string,     // we can use this for the race geolocation
    item_category3?: string,   //any other specification
    item_category4?: string,   //any other specification
    item_variant?: string,   // we can use this for example the team type
    quantity?: string, // mainly it will be 1, but if someone register 2 team for the sme race it could be more
}

export interface GAnalyticsPurchaseForEcommerce {
    currency: string,
    value: number
    tax: number,
    shipping: number,
    affiliation: string,
    transaction_id: string,
    coupon: string,
}
export interface GAnalyticsSiteMessage {
    messageType: string,
    messageContent: string,
}

@Injectable({
    providedIn: 'root',
})
export class GoogleAnalytics {
    apiUrl = environment.profilesBaseUrl;
    dataLayer: any = [];
    browser = ''
    agent = window.navigator.userAgent.toLowerCase()
    constructor(private http: HttpClient) {
        switch (true) {
            case this.agent.indexOf('edg') > -1:
                this.browser = 'edge';
                break;
            case this.agent.indexOf('opr') > -1:
                this.browser = 'opera';
                break;
            case this.agent.indexOf('chrome') > -1:
                this.browser = 'chrome';
                break;
            case this.agent.indexOf('trident') > -1:
                this.browser = 'ie';
                break;
            case this.agent.indexOf('firefox') > -1:
                this.browser = 'firefox';
                break;
            case this.agent.indexOf('safari') > -1:
                this.browser = 'safari';
                break;
            default:
                this.browser = 'other';
        }
    }

    sendingPageInitToGoogleAnalytics(screen_name: string, visitorEmail: string, pagePostType?: string) {

        this.dataLayer.push({
            event: "pageInit",
            screen_name: screen_name || '', // the page name what the user see, especcially important when the ulr doesnt changes
            visitorLoginState: sessionStorage.getItem('user') ? 'logged-in' : 'logged-out',
            // user_id: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).id: '',
            visitorType: 'visitor' + (sessionStorage.getItem('user') ? 'logged-in' : 'logged-out'),
            visitorEmail: visitorEmail || '',
            visitorEmailHash: '',
            pagePostType: pagePostType || '',
            pagePostType2: 'single-page',
            browserName: this.browser,
            browserVersion: '',
            browserEngineName: "",
            browserEngineVersion: "",
            osName: "",
            osVersion: "",
            deviceType: "",
            deviceManufacturer: '',
            deviceModel: '',
            customerTotalOrders: 0,
            customerTotalOrderValue: '0.00',
            customerFirstName: '',
            customerLastName: '',
            customerBillingFirstName: '',
            customerBillingLastName: '',
            customerBillingCompany: '',
            customerBillingAddress1: '',
            customerBillingAddress2: '',
            customerBillingCity: '',
            customerBillingPostcode: '',
            customerBillingCountry: '',
            customerBillingEmail: '',
            customerBillingEmailHash: '',
            customerBillingPhone: '',
            customerShippingFirstName: '',
            customerShippingLastName: '',
            customerShippingCompany: '',
            customerShippingAddress1: '',
            customerShippingAddress2: '',
            customerShippingCity: '',
            customerShippingPostcode: '',
            customerShippingCountry: '',
        });


    }
    sendingEcommersEventToGoogleAnalytics(activityType: string, product: GAnalyticsProductForEcommerce, purchase?: GAnalyticsPurchaseForEcommerce, siteMessage?: GAnalyticsSiteMessage) {
        if (!product.item_brand)
            product.item_brand = 'ragnar';

        switch (activityType) {
            case "BEGING_CHECKOUT":
                this.dataLayer.push({
                    "event": "begin_checkout",
                    ecommerce: {
                        items: [{ ...product }],
                    },
                });
                break;
            case "ADD_SHIPPING_INFO":
                this.dataLayer.push({
                    "event": "add_shipping_info",
                    ecommerce: {
                        payment_type: 'card',

                        ...purchase,
                        items: [{ ...product }],
                    },
                });
                break;
            case "ADD_PAYMENT_INFO":
                this.dataLayer.push({
                    "event": "add_payment_info",
                    ecommerce: {
                        payment_type: 'card',

                        ...purchase,
                        items: [{ ...product }],
                    },
                });
                break;
            case "PURCHASE":
                this.dataLayer.push({
                    "event": "purchase",
                    ecommerce: {
                        payment_type: 'card',
                        ...purchase,
                        items: [{ ...product }],
                    },
                });
                break;
            default:
                break;
        }
    }
    sendingGoogleAnalyticsData(activityType: string, product: GAnalyticsProduct, purchase?: GAnalyticsProduct): void {
        if (!product.brand)
            product.brand = 'ragnar'

        switch (activityType) {
            case "CHECKOUT_CAPTAIN":
                (<any>window).ga('ec:addProduct', product);
                (<any>window).ga('ec:setAction', 'checkout', {
                    'step': 1
                });
                break;
            case "CHECKOUT_PAYMENT":
                (<any>window).ga('ec:addProduct', product);
                (<any>window).ga('ec:setAction', 'checkout', {
                    'step': 2
                });
                break;
            case "CHECKOUT_PAYMENT_DONE":
                (<any>window).ga('ec:addProduct', product);
                (<any>window).ga('ec:setAction', 'purchase', purchase);
                this.dataLayer.push({ "event": "product", ...product });
                this.dataLayer.push({ "event": "purchase", ...purchase });
                break;
            default:
                break;
        }
        (<any>window).ga('send', 'pageview');
    }

    sendingFormsEventToGoogleAnalytics(activityType: string, obj: any) {
        switch (activityType) {

            case "SITE_MESSAGE":
                this.dataLayer.push({
                    "event": "siteMessage",
                    ...obj
                });
                break;

            case 'FORM_SUBMIT':
                this.dataLayer.push({
                    event: 'formSubmitRagnar',
                    ...obj,
                })
                break;

            case 'FORM_ELEMENT_ENTER':
                this.dataLayer.push({
                    event: 'formElementEnter',
                    ...obj,
                })
                break;

            case 'FORM_ELEMENT_EXIT':
                this.dataLayer.push({
                    event: 'formElementExit',
                    ...obj,
                })
                break;
        }
    }
}
