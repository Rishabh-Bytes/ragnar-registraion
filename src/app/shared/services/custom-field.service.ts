import { environment } from "src/environments/environment.staging";
import { BaseDataService } from "./base.service";
import { Injectable } from "@angular/core";
import { RequestService } from "./request.service";
import * as _ from 'lodash';
import { HttpClient } from "@angular/common/http";


const APPLIES_TO_MINORS = 'APPLIES_TO_MINORS';

export enum CustomFieldsGroupType {
    Form = <any>"form",
    Confirmation = <any>"confirmation",
    Waiver = <any>"waiver"
}

export class CustomFieldsGroup {
    id: string
    name: string
    description: string
    type: CustomFieldsGroupType
    createdAt: Date
    customFields: CustomField[]
    appliesToMinors: boolean // only for waivers

    init (data?: any) : void {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.description = data["description"];
            this.type = data["type"];
            this.createdAt = data["createdAt"];
            this.appliesToMinors = data["appliesToMinors"];

            if (data["customFields"] && data["customFields"].constructor === Array) {
                this.customFields = [];

                for (let item of data["customFields"]) {
                    this.customFields.push(CustomField.fromJS(item));
                }
            }

            if (this.type === CustomFieldsGroupType.Waiver) {
                let appliesToMinorsField = _.find(this.customFields, (field) => field.name === APPLIES_TO_MINORS);

                if (appliesToMinorsField) {
                    this.appliesToMinors = appliesToMinorsField.fieldLabel === 'true';
                } else {
                    this.appliesToMinors = (this.appliesToMinors) ? true : false;
                }
            }
        }
    }

    static fromJS (data: any) : CustomFieldsGroup {
        let result = new CustomFieldsGroup();
        result.init(data);
        return result;
    }

    toJSON (data?: any) : Object {
        data = typeof data === 'object' ? data : {};

        data["id"] = this.id;
        data["name"] = this.name;
        data["description"] = this.description;
        data["type"] = this.type;
        data["createdAt"] = this.createdAt;
        data["appliesToMinors"] = this.appliesToMinors;

        if (this.type === CustomFieldsGroupType.Waiver) {
            if (!(this.customFields && this.customFields.constructor === Array)) {
                this.customFields = [];
            }

            let appliesToMinorsField = _.find(this.customFields, (field) => field.name === APPLIES_TO_MINORS);

            if (!appliesToMinorsField) {
                appliesToMinorsField = CustomField.fromJS({
                    name: APPLIES_TO_MINORS,
                    groups: [this.name],
                    resource:  CustomFieldResource.Attribute,
                    type: CustomFieldType.Internal,
                    fieldType: CustomFieldFieldType.Value,
                    fieldStyle: CustomFieldFieldStyle.Checkbox,
                    fieldRequired: CustomFieldFieldStyle.Checkbox
                });

                this.customFields.push(appliesToMinorsField);
            }

            appliesToMinorsField.fieldLabel = this.appliesToMinors ? 'true' : 'false';
        }

        if (this.customFields && this.customFields.constructor === Array) {
            data["customFields"] = [];

            for (let item of this.customFields) {
                data["customFields"].push(item.toJSON());
            }
        }

        return data; 
    }
}

export class CustomField implements ICustomField {
    id: string;
    name: string;
    resource: CustomFieldResource;
    type: CustomFieldType;
    fieldType: CustomFieldFieldType;
    fieldStyle: CustomFieldFieldStyle;
    fieldRequired: CustomFieldFieldStyle;
    fieldLabel: string;
    groups: string[] = [];
    options?: Option[] | undefined;
    hint: string;

    constructor(data?: ICustomField) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.name = data["name"];
            this.resource = data["resource"];
            this.type = data["type"];
            this.fieldType = data["fieldType"];
            this.fieldStyle = data["fieldStyle"];
            this.fieldRequired = data["fieldRequired"];
            this.fieldLabel = data["fieldLabel"];
            this.hint = data["hint"];
            if (data["groups"] && data["groups"].constructor === Array) {
                this.groups = [];
                for (let item of data["groups"])
                    this.groups.push(item);
            }
            if (data["options"] && data["options"].constructor === Array) {
                this.options = [];
                for (let item of data["options"])
                    this.options.push(Option.fromJS(item));
            }
        }
    }

    static fromJS(data: any): CustomField {
        let result = new CustomField();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["resource"] = this.resource;
        data["type"] = this.type;
        data["fieldType"] = this.fieldType;
        data["fieldStyle"] = this.fieldStyle;
        data["fieldRequired"] = this.fieldRequired;
        data["fieldLabel"] = this.fieldLabel;
        data["hint"] = this.hint;
        if (this.groups && this.groups.constructor === Array) {
            data["groups"] = [];
            for (let item of this.groups)
                data["groups"].push(item);
        }
        if (this.options && this.options.constructor === Array) {
            data["options"] = [];
            for (let item of this.options)
                data["options"].push(item.toJSON());
        }
        return data;
    }
}

export interface ICustomField {
    name: string;
    resource: CustomFieldResource;
    type: CustomFieldType;
    fieldType: CustomFieldFieldType;
    fieldRequired: CustomFieldFieldStyle;
    fieldStyle: CustomFieldFieldStyle;
    fieldLabel: string;
    groups: string[];
    options?: Option[] | undefined;
}

export enum CustomFieldResource {
    Attribute = <any>"attribute",
}

export enum CustomFieldType {
    Question = <any>"question",
    AddOn = <any>"add-on",
    Internal = <any>"internal"
}

export enum CustomFieldFieldType {
    List = <any>"list",
    Value = <any>"value",
}

export enum CustomFieldFieldStyle {
    Radio = <any>"radio",
    Checkbox = <any>"checkbox",
    Textarea = <any>"textarea",
    Text = <any>"text",
    Url = <any>"url",
    ImgUrl = <any>"img-url",
    Select = <any>"select",
    SelectMultiple = <any>"select-multiple",
}

export class Option implements IOption {
    id?: string | undefined;
    label?: string | undefined;

    constructor(data?: IOption) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(data?: any) {
        if (data) {
            this.id = data["id"];
            this.label = data["label"];
        }
    }

    static fromJS(data: any): Option {
        let result = new Option();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["label"] = this.label;
        return data;
    }
}

export interface IOption {
    id?: string | undefined;
    label?: string | undefined;
}


@Injectable({
    providedIn: 'root',
})
export class CustomFieldDataService extends BaseDataService {
    /* @ngInject */
    constructor(private RequestService: RequestService, private http: HttpClient) {
        super();
    }


    getCustomFieldsGroupByIds(groupIds: string[]) {
        // let request = {
        //     url: environment.customFieldsBaseUrl + '/groups/ids',
        //     data: { ids: groupIds }
        // };

     let url = environment.customFieldsBaseUrl + '/groups/ids';

     let data = {
        'ids': groupIds
     }
     return this.http.post(url, data).toPromise();
        // return this.RequestService.post(request);




        // return this.transformOptions(request).then((request: any) => {
        //     return this.RequestService.post(request);
        // }).then((data: any) => {
        //     let result = null;

        //     if (Array.isArray(data)) {
        //         result = [];

        //         for (let item of data) {
        //             result.push(CustomFieldsGroup.fromJS(item));
        //         }
        //     }
        //     return result;
        // });
    }
}