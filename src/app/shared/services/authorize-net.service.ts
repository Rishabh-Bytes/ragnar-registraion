import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface ICardData {
  name: string;
  cardNumber: string;
  month: string;
  year: string;
  cardCode: string;
  zip?: string;
  expiration: string;
}

export interface IOPaqueData {
  dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT';
  dataValue: string;
}

export interface IMessage {
  code: string;
  text: string;
}

interface ISecureData {
  cardData?: ICardData;
  authData?: IAuthData;
}

interface IAuthData {
  clientKey?: string;
  apiLoginID?: string;
}

export interface IAuthorizeNetService {
  authorize(cardData: ICardData): Promise<IOPaqueData>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthorizeNetService {
  Accept: any;
  /* @ngInject */
  constructor() {}

  authorize(cardData: ICardData) {
    let exp = cardData.expiration.split('/');
    cardData.month = exp[0];
    cardData.year = exp[1];

    let secureData: ISecureData = {},
      authData: IAuthData = {};
    // deferred = this.$q.defer<IOPaqueData>();

    // Extract the card number, expiration date, and card code.
    secureData.cardData = cardData;

    // The Authorize.Net Client Key is used in place of the traditional Transaction Key. The Transaction Key
    // is a shared secret and must never be exposed. The Client Key is a public key suitable for use where
    // someone outside the merchant might see it.
    authData.clientKey = environment.authorizeNet.clientKey;
    authData.apiLoginID = environment.authorizeNet.apiLoginID;
    secureData.authData = authData;
    secureData.cardData.cardNumber = secureData.cardData.cardNumber.replace(
      / /g,
      ''
    );
    // Pass the card number and expiration date to Accept.js for submission to Authorize.Net.
    this.Accept.dispatchData(secureData, (response: any) => {
      // Process the response from Authorize.Net to retrieve the two elements of the payment nonce.
      // If the data looks correct, record the OpaqueData to the console and call the transaction processing function.
      if (response.messages.resultCode === 'Error') {
        // deferred.reject(response.messages.message);
        /*
                    for (var i = 0; i < response.messages.message.length; i++) {
                        console.log(response.messages.message[i].code + ": " + response.messages.message[i].text);
                    }
                    */
      } else {
        // deferred.resolve(response.opaqueData);
      }
    });

    // return deferred.promise;
  }
}
