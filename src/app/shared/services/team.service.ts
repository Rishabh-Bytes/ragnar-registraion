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