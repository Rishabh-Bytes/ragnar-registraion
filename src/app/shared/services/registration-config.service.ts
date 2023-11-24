import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment.staging';
import { Injectable } from '@angular/core';
import { CustomAttribute } from './team.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationConfigService {
  constructor(private http: HttpClient) {}
  /**
   * Get RegistrationConfig by ID
   * @id registration config id
   * @return SUCCESS
   */
  getRegistrationConfigById(id: string) {
    let url_ = environment.registrationsConfigBaseUrl + '/{id}';
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    return this.http.get(url_).toPromise();
  }

  /**
   * Get data for registration form
   * @regConfId Registration config ID
   * @vipCode Vip code
   * @return SUCCESS
   */
  dataRegistrations(regConfId: string, vipCode?: string | null) {
    let url_ = environment.registrationsConfigBaseUrl + '/{regConfId}/data?';
    if (regConfId === undefined || regConfId === null)
      throw new Error("The parameter 'regConfId' must be defined.");
    url_ = url_.replace('{regConfId}', encodeURIComponent('' + regConfId));
    if (vipCode !== undefined)
      url_ += 'vipCode=' + encodeURIComponent('' + vipCode) + '&';
    url_ = url_.replace(/[?&]$/, '');

    return this.http.get(url_).toPromise();
  }

  getTeamPrices(regConfId: string) {
    let url_ = environment.registrationsBaseUrl + '/{regConfId}/getTeamPrices';
    if (regConfId === undefined || regConfId === null)
      throw new Error("The parameter 'regConfId' must be defined.");
    url_ = url_.replace('{regConfId}', encodeURIComponent('' + regConfId));
    url_ = url_.replace(/[?&]$/, '');
    const content_ = '';

    return this.http.get(url_).toPromise();
  }

  /**
   * List registrations
   * @limit The number of items to return per page
   * @page page number to get
   * @search filter by name
   * @return SUCCESS
   */
  getRegistrations(
    registrationConfigId: string,
    search?: string,
    limit?: number,
    page?: number,
    email?: string,
    role?: string,
    order?: string,
    excludeRole?: string
  ) {
    let url_ =
      environment.registrationsBaseUrl +
      '/' +
      registrationConfigId +
      '/registrations?';
    if (limit !== undefined)
      url_ += 'limit=' + encodeURIComponent('' + limit) + '&';
    if (page !== undefined)
      url_ += 'page=' + encodeURIComponent('' + page) + '&';
    if (search !== undefined)
      url_ += 'search=' + encodeURIComponent('' + search) + '&';
    if (email !== undefined)
      url_ += 'email=' + encodeURIComponent('' + email) + '&';
    if (role !== undefined)
      url_ += 'role=' + encodeURIComponent('' + role) + '&';
    if (order !== undefined)
      url_ += 'order=' + encodeURIComponent('' + order) + '&';
    if (excludeRole !== undefined)
      url_ += 'excludeRole=' + encodeURIComponent('' + excludeRole) + '&';
    url_ = url_.replace(/[?&]$/, '');

    const content_ = '';

    return this.http.get(url_).toPromise();
  }

  /**
   * Calculate price
   * @regConfId registration config id
   * @body time data
   * @return SUCCESS
   */
  postOrderPrice(
    regConfId: string,
    body: Payment,
    isGlamping: boolean = false
  ) {
    let url_ =
      environment.registrationsConfigBaseUrl + '/{regConfId}/orders/calculate?';
    if (regConfId === undefined || regConfId === null)
      throw new Error("The parameter 'regConfId' must be defined.");
    url_ = url_.replace('{regConfId}', encodeURIComponent('' + regConfId));
    if (isGlamping !== undefined)
      url_ += 'isGlamping=' + encodeURIComponent('' + isGlamping) + '&';
    url_ = url_.replace(/[?&]$/, '');

    const content_ = JSON.stringify(body);

    return this.http.post(url_, content_).toPromise();
  }

  getByProfileId(profileId: string) {
    let url_ =
      environment.registrationsBaseUrl + '/profiles/getUser/' + profileId;
    url_ = url_.replace(/[?&]$/, '');

    const content_ = '';
    return this.http.get(url_).toPromise();
  }
}

export class Payment {
  id?: string | undefined;
  org?: string | undefined;
  eventType: string;
  teamType: string;
  couponCode: string;
  vipCode?: string | undefined;
  token: IOPaqueData;
  totalPrice: string | undefined;
  paidPrice: string | undefined;
  stage: string | undefined;
  subTotalAmount: string | undefined;
  taxAmount: string | undefined;
  serviceFeeAmount: string | undefined;
  discountAmount: string | undefined;
  cardNumber?: number | undefined;

  init(data?: any) {
    if (data) {
      this.id = data['id'];
      this.org = data['org'];
      this.eventType = data['eventType'];
      this.teamType = data['teamType'];
      this.couponCode = data['couponCode'];
      this.vipCode = data['vipCode'];
      this.token = data['token'];
      this.totalPrice = data['totalPrice'];
      this.paidPrice = data['paidPrice'];
      this.stage = data['stage'];
      this.subTotalAmount = data['subTotalAmount'];
      this.taxAmount = data['taxAmount'];
      this.serviceFeeAmount = data['serviceFeeAmount'];
      this.discountAmount = data['discountAmount'];
      this.cardNumber = data['cardNumber'];
    }
  }

  static fromJS(data: any): Payment {
    let result = new Payment();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['id'] = this.id;
    data['org'] = this.org;
    data['eventType'] = this.eventType;
    data['teamType'] = this.teamType;
    data['couponCode'] = this.couponCode;
    data['vipCode'] = this.vipCode;
    data['token'] = this.token;
    data['totalPrice'] = this.totalPrice;
    data['paidPrice'] = this.paidPrice;
    data['stage'] = this.stage;
    data['subTotalAmount'] = this.subTotalAmount;
    data['taxAmount'] = this.taxAmount;
    data['serviceFeeAmount'] = this.serviceFeeAmount;
    data['discountAmount'] = this.discountAmount;
    data['cardNumber'] = this.cardNumber;
    return data;
  }
}

export interface IOPaqueData {
  dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT';
  dataValue: string;
}

export class Registration {
  org?: string | undefined;
  id?: string | undefined;
  registrationConfigId: string;
  name: string;
  role?: string | undefined;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  bornAt?: string | undefined;
  gender?: string | undefined;
  phone?: any;
  country?: string | undefined;
  address?: string | undefined;
  address2?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  zipCode?: number | undefined;
  type: string;
  customAttributes?: CustomAttribute[] | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  teamId?: string | null;
  teamName?: string | null;
  groupVolunteerId?: string | null;
  groupVolunteerName?: string | null;
  shifts?: Array<string> | null; /* For Group Volunteer Bulk Registration */
  order?: number | null;
  pace?: number | null;
  job?: Job | null;
  shift?: Shift | null;
  extraFees?: boolean | null;
  waiversSigned?: boolean | null;
  waiverInitials?: string | null;
  shiftConfirmed?: boolean | null;
  profilesId?: string | null;
  tShirtSize?: string | null;
  waiversSnapshot?: string | null;
  formData?: any;
  isAdmin?: boolean;
  init(data?: any) {
    if (data) {
      this.org = data['org'];
      this.id = data['id'];
      this.registrationConfigId = data['registrationConfigId'];
      this.name = data['name'];
      this.role = data['role'];
      this.email = data['email'];
      this.firstName = data['firstName'];
      this.lastName = data['lastName'];
      this.bornAt = data['bornAt'];
      this.gender = data['gender'];
      this.phone = data['phone'];
      this.country = data['country'];
      this.address = data['address'];
      this.address2 = data['address2'];
      this.city = data['city'];
      this.state = data['state'];
      this.zipCode = data['zipCode'];
      this.type = data['type'];
      if (
        data['customAttributes'] &&
        data['customAttributes'].constructor === Array
      ) {
        this.customAttributes = [];
        for (let item of data['customAttributes'])
          this.customAttributes.push(CustomAttribute.fromJS(item));
      }
      this.createdAt = data['createdAt'];
      this.updatedAt = data['updatedAt'];
      this.teamId = data['teamId'];
      this.teamName = data['teamName'];
      this.groupVolunteerName = data['groupVolunteerName'];
      this.groupVolunteerId = data['groupVolunteerId'];
      this.shifts = data['shifts'];
      this.order =
        data['order'] === undefined ? 0 : parseInt(data['order'], 10);
      this.pace =
        data['pace'] === undefined ? undefined : parseInt(data['pace'], 10);
      this.job = data['job'];
      this.shift = data['shift'];
      this.extraFees =
        data['extraFees'] === undefined
          ? undefined
          : data['extraFees'] === 1 || data['extraFees'] === true;
      this.waiversSigned =
        data['waiversSigned'] === undefined
          ? undefined
          : data['waiversSigned'] === 1 || data['waiversSigned'] === true;
      this.shiftConfirmed =
        data['shiftConfirmed'] === undefined
          ? undefined
          : data['shiftConfirmed'] === 1 || data['shiftConfirmed'] === true;
      this.profilesId = data['profilesId'];
      this.tShirtSize = data['tShirtSize'];
      this.waiversSnapshot = data['waiversSnapshot'];
      this.formData = data['formData'];
      this.waiverInitials = data['waiverInitials'];
    }
  }

  static fromJS(data: any): Registration {
    let result = new Registration();
    result.init(data);
    return result;
  }
}

export class Job {
  registrationConfigId: string;
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  fullShifts: number;
  totalShifts: number;
  groupTotalShifts: number;
  groupFullShifts: number;
  shifts: Shift[];
  priority: number;
  startDate: any;
  endDate: any;
  position: number;

  available: number;
}

export class Shift {
  registrationConfigId: string;
  jobName: string; /* TODO: should be Optional */
  shiftType: string;
  jobId: string;
  id: string;
  startDate: any;
  startTime: number;
  endDate: any;
  endTime: number;
  capacity: number;
  assigned: number;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;

  groupShiftCapacity: number;
  groupShiftAssigned: number;
  groupVolunteerId: string;
  groupVolunteers?: Registration[];
  available: number;
  index: number;
}

export class VolunteerRequirements {
  registrationConfigId: string;
  shiftOpen: Date;
  shiftClose: Date;
  deadline: Date;
  types: any;
  VIP: Date;
  EARLY: Date;
  REGULAR: Date;
  LAST_CHANCE: Date;
}

export class OrderPrice {
  subTotal: number;
  discounts: number;
  total: number;
  fees: number;
  taxes: number;
  unitPrice?: number;
  stage?: string;
}
