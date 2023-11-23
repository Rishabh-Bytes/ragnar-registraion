export interface IRegistrationCaptainState {
    user: User
    regConfigId: string
    registrationData: RegistrationData
    registrationConfig: RegistrationConfig
    team: Team
    captain: Registration
    price?: OrderPrice
    promoCode?: string
    order?: CreateOrderResponse
    vipCode?: string
    isVip?: boolean
    waiversChecked: boolean,
    teamPrices?: any
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    bornAt: string
    dateOfBirth: string
    gender: string
    address: string
    phone: string
    pace: number
    tShirtSize: string
    address2: string
    country: string
    city: string
    state: string
    zipCode: number
    jwtToken: string
    registrationConfigId?: string
}

export interface RegistrationData {
    stage?: string | undefined;
    open?: boolean | undefined;
    is_full?: boolean | undefined;
    isVip?: boolean | undefined;
    divisions?: TeamDivision[] | undefined;
    classifications?: TeamClassification[] | undefined;
    types?: string[] | undefined;
}

export interface TeamDivision {
    id: string
    name: string
}

export interface TeamClassification {
    id: string;
    name: string
}

export interface RegistrationConfig {
    id: string;
    name: string;
    type: string;
    teamCap: number;
    teamGoal: number;
    group_vol_minor_url: string | undefined;
    blackloopTeamGoal: number;
    glampingCap?: number;
    glampingPrice?: number;
    startDate?: string | undefined;
    endDate?: string | undefined;
    timezone?: string | undefined;
    onlineFeeDate?: string | undefined;
    lateFee10?: string | undefined;
    lateFee20?: string | undefined;
    lateFee10Amount?: number | undefined;
    lateFee20Amount?: number | undefined;
    teamNameChange?: string | undefined;
    funnel?: RegistrationFunnel | undefined;
    volunteerFunnel?: RegistrationFunnel | undefined;
    isLive: boolean;
    raceId: string | undefined;
    raceYear: string | undefined;
    raceName: string | undefined;
    teamFreezeDate: string | undefined;
    raceSlug?: string | undefined;
}

export interface RegistrationFunnel {
    registrationConfigId: string;
    confirmation: any;
    waiver: any[];
    form: any;
}

export interface Registration {
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
    customAttributes?: any;
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
    isAdmin?: boolean
}

export interface Job {
    registrationConfigId: string
    id: string
    name: string
    location: string
    address: string
    city: string
    state: string
    zip: string
    latitude: number
    longitude: number
    description: string
    createdAt: Date
    updatedAt: Date
    fullShifts: number
    totalShifts: number
    groupTotalShifts: number
    groupFullShifts: number
    shifts: Shift[]
    priority: number
    startDate: any
    endDate: any
    position: number
    available: number
}

export interface Shift {
    registrationConfigId: string
    jobName: string
    shiftType: string
    jobId: string
    id: string
    startDate: any
    startTime: number
    endDate: any
    endTime: number
    capacity: number
    assigned: number
    private: boolean
    createdAt: Date
    updatedAt: Date
    groupShiftCapacity: number
    groupShiftAssigned: number
    groupVolunteerId: string
    groupVolunteers?: Registration[]
    available: number
    index: number
}

export interface Team {
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
    customAttributes?: any;
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
    registrationPeriod?: string | undefined;
    isCountMismatch?: boolean | undefined;
}

export interface OrderPrice {
    subTotal: number;
    discounts: number;
    total: number;
    fees: number;
    taxes: number;
    unitPrice?: number;
    stage?: string;
}

export interface CreateOrderResponse {
    orderId: string;
    message?: string | undefined;
    paidAmount?: number | 0;
    transcationId?: string | '';
}

export interface IRedirectParams {
    stateName: string
    params: Object
}

export type Category = 'REGULAR' | 'ULTRA' | 'HIGH_SCHOOL' | 'SIX_PACK' | 'BLACK_LOOP';
