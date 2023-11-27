export type Category = 'REGULAR' | 'ULTRA' | 'HIGH_SCHOOL' | 'SIX_PACK' | 'BLACK_LOOP';

export class Team {
    org?: string | undefined;
    id?: string | undefined;
    registrationConfigId: string;
    name: string;
    role?: string | undefined;
    type: Category;
    captainId?: string | undefined;
    volunteersCount?: number | undefined;
    runnersCount?: number | undefined;
    teamInviteUrl?: string | undefined;
    isGlampingPurchased?: string | undefined;
    glampingPurchasedDate?: string | undefined;
    startTime?: number | undefined | null;
    customAttributes?: CustomAttribute[] | undefined;
    teamPace?: number | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    runnersMax?: number | undefined;
    volunteersMax?: number | undefined;
    classification?: string | undefined;
    division?: string | undefined;
    exemptions?: number | undefined;
    paidExemptions?: number | undefined;
    charity?: string | undefined;
    vanNumber?: string | undefined;
    notes?: string | undefined;
    teamNumber?: number | undefined;
    registrationPeriod?: string|undefined;
    isCountMismatch?: boolean|undefined;

    init(data?: any) {
        if (data) {
            this.runnersMax = data["runnersMax"];
            this.volunteersMax = data["volunteersMax"];
            this.classification = data["classification"] ? data["classification"] : undefined;
            this.division = data["division"] ? data["division"] : undefined;
            this.org = data["org"];
            this.id = data["id"];
            this.registrationConfigId = data["registrationConfigId"];
            this.name = data["name"];
            this.role = data["role"];
            this.type = data["type"];
            this.captainId = data["captainId"];
            this.volunteersCount = data["volunteersCount"];
            this.runnersCount = data["runnersCount"];
            this.teamInviteUrl = data["teamInviteUrl"];
            this.startTime = data["startTime"];
            this.isGlampingPurchased = data["isGlampingPurchased"]
            this.glampingPurchasedDate = data["glampingPurchasedDate"]
            if (data["customAttributes"] && data["customAttributes"].constructor === Array) {
                this.customAttributes = [];
                for (let item of data["customAttributes"])
                    this.customAttributes.push(CustomAttribute.fromJS(item));
            }
            this.teamPace = data["teamPace"] || 0;
            this.createdAt = data["createdAt"];
            this.updatedAt = data["updatedAt"];
            this.exemptions = data.hasOwnProperty('exemptions') ? (data["exemptions"] || 0) : undefined;
            this.paidExemptions = data.hasOwnProperty('paidExemptions') ? (data["paidExemptions"] || 0) : undefined;
            this.charity = data["charity"];
            this.vanNumber = data["vanNumber"];
            this.notes = data["notes"];
            this.teamNumber = data["teamNumber"];
            this.registrationPeriod = data["registrationPeriod"];
        }
    }

    static fromJS(data: any): Team {
        let result = new Team();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["runnersMax"] = this.runnersMax;
        data["volunteersMax"] = this.volunteersMax;
        data["classification"] = this.classification ? this.classification : undefined;
        data["division"] = this.division ? this.division : undefined;
        data["org"] = this.org;
        data["id"] = this.id;
        data["registrationConfigId"] = this.registrationConfigId;
        data["name"] = this.name;
        data["role"] = this.role;
        data["type"] = this.type;
        data["captainId"] = this.captainId;
        data["volunteersCount"] = this.volunteersCount;
        data["runnersCount"] = this.runnersCount;
        data["teamInviteUrl"] = this.teamInviteUrl;
        data["startTime"] = this.startTime;
        if (this.customAttributes && this.customAttributes.constructor === Array) {
            data["customAttributes"] = [];
            for (let item of this.customAttributes)
                data["customAttributes"].push(item.toJSON());
        }
        data["teamPace"] = this.teamPace;
        data["createdAt"] = this.createdAt;
        data["glampingPurchasedDate"] = this.glampingPurchasedDate
        data["isGlampingPurchased"] = this.isGlampingPurchased
        data["updatedAt"] = this.updatedAt;
        data["exemptions"] = this.exemptions;
        data["paidExemptions"] = this.paidExemptions;
        data["charity"] = this.charity;
        data["vanNumber"] = this.vanNumber;
        data["notes"] = this.notes;
        data["teamNumber"] = this.teamNumber;
        data["registrationPeriod"] = this.registrationPeriod;
        return data;
    }

}

export class CustomAttribute {
    name: string;
    resource: CustomAttributeResource;
    type: CustomAttributeType;
    fieldType: CustomAttributeFieldType;
    fieldStyle: CustomAttributeFieldStyle;
    fieldRequired: CustomAttributeFieldStyle;
    fieldLabel: string;
    groups: string[] = [];
    options?: Option[] | undefined;

    init(data?: any) {
        if (data) {
            this.name = data["name"];
            this.resource = data["resource"];
            this.type = data["type"];
            this.fieldType = data["fieldType"];
            this.fieldStyle = data["fieldStyle"];
            this.fieldRequired = data["fieldRequired"];
            this.fieldLabel = data["fieldLabel"];
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

    static fromJS(data: any): CustomAttribute {
        let result = new CustomAttribute();
        result.init(data);
        return result;
    }
    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["resource"] = this.resource;
        data["type"] = this.type;
        data["fieldType"] = this.fieldType;
        data["fieldStyle"] = this.fieldStyle;
        data["fieldRequired"] = this.fieldRequired;
        data["fieldLabel"] = this.fieldLabel;
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

export enum CustomAttributeResource {
    Attribute = <any>"attribute",
}

export enum CustomAttributeType {
    Question = <any>"question",
    AddOn = <any>"add-on",
}

export enum CustomAttributeFieldType {
    List = <any>"list",
    Value = <any>"value",
}

export enum CustomAttributeFieldStyle {
    Radio = <any>"radio",
    Checkbox = <any>"checkbox",
    Textarea = <any>"textarea",
    Text = <any>"text",
    Url = <any>"url",
    ImgUrl = <any>"img-url",
    Select = <any>"select",
    SelectMultiple = <any>"select-multiple",
}