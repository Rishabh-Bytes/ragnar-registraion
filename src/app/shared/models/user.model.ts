import * as moment from "moment";

export class User {
  id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  bornAt: string = '';
  dateOfBirth: string = '';
  gender: string = '';
  address: string = '';
  phone: string = '';
  pace: number = 0;
  tShirtSize: string = '';
  address2: string = '';
  country: string = '';
  city: string = '';
  state: string = '';
  zipCode: number = 0;
  jwtToken: string = '';
  registrationConfigId?: string = '';

  init (data?: any) : void {
    if (data) {
        this.id = data["id"];
        this.firstName = data["firstName"];
        this.lastName = data["lastName"];
        this.email = data["email"] || data["emailAddress"];
        this.password = data["password"];
        this.address = data["address"];
        this.phone = data["phone"];
        this.tShirtSize = data["tShirtSize"] || data["shirtSize"];
        this.address2 = data["address2"];
        this.country = data["country"];
        this.city = data["city"];
        this.state = data["state"];
        this.zipCode = data["zipCode"];
        this.jwtToken = data["jwtToken"];
        let bornAt = data["bornAt"] || data["dateOfBirth"];
        if (bornAt && moment(bornAt).isValid()) {
            this.bornAt = moment(bornAt).format("YYYY-MM-DD");
        }

        let gender = data["gender"];
        if (gender === 'FEMALE' || gender === 'MALE' || gender === 'NON_BINARY' || gender === 'PREFER_NOT_TO_SELF_IDENTIFY') {
            this.gender = gender;
        } else if (gender == 1) {
            this.gender = 'MALE';
        } else if (gender == 2) {
            this.gender = 'FEMALE';
        }

        let pace = data["pace"] || data["runPace"];
        if (typeof pace === 'string') {
            let match = pace.match(/(\d+):(\d+)/);
            if (match) {
                this.pace = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
            }
        } else {
            this.pace = pace;
        }

        let tShirtSize = data["tShirtSize"] || data["shirtSize"];
        let tShirtSizeMap = {
            1: 'XS',
            2: 'S',
            3: 'M',
            4: 'L',
            5: 'XL'
        };
        // this.tShirtSize = tShirtSizeMap[tShirtSize] || tShirtSize;
    }
}

  static fromJS (data: any) : User {
    let result = new User();
    result.init(data);
    return result;
}

toJSON (data?: any) : Object {
    data = typeof data === 'object' ? data : {};

    data["id"] = this.id;
    data["firstName"] = this.firstName;
    data["lastName"] = this.lastName;
    data["email"] = this.email;
    data["password"] = this.password;
    data["bornAt"] = this.bornAt;
    data["dateOfBirth"] = this.dateOfBirth;
    data["gender"] = this.gender;
    data["address"] = this.address;
    data["phone"] = this.phone;
    data["pace"] = this.pace;
    data["tShirtSize"] = this.tShirtSize;
    data["address2"] = this.address2;
    data["country"] = this.country;
    data["city"] = this.city;
    data["state"] = this.state;
    data["zipCode"] = this.zipCode;
    data["registrationConfigId"] = this.registrationConfigId;
    
    return data;
}
}
