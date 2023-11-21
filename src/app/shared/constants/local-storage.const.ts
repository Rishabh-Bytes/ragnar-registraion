export const LOCAL_STORAGE_CONST = {
  // JWT_TOKEN: 'JWT_TOKEN',
  JWT_TOKEN: 'jwtToken-user',

};

export const localStorageConstant = {
  profilesUser: 'profilesUser',
  redirectTo: 'redirectTo',
  virtualChallengeGreetinModal: 'virtualChallengeGreetinModal',
  jwtToken: 'jwtToken-user',
  challenge: 'challenge',
};

export const rolesConstant = {
  admin: 'ADMIN',
  customerService: 'CUSTOMER_SERVICE',
  finance: 'FINANCE',
  marketing: 'MARKETING',
  mdm: 'MDM',
  raceDirector: 'RACE_DIRECTOR',
  volunteerManager: 'VOLUNTEER_MANAGER',
  fieldOps: 'FIELD_OPS',
};

export const typesConstant: Array<string> = [
  'ROAD',
  'TRAIL',
  'SPRINT',
  'SUNSET',
  'TRAIL_SPRINT',
];
export const categoryConstant: Array<string> = [
  'REGULAR',
  'ULTRA',
  'HIGH_SCHOOL',
  'SIX_PACK',
  'BLACK_LOOP',
];

export const DATE_FORMAT = 'MMMM DD, YYYY';

export const DATE_RANGE_DAY_FORMAT = ['MMMM DD', 'DD, YYYY'];
export const DATE_RANGE_MONTH_FORMAT = ['MMMM DD', 'MMMM DD, YYYY'];
export const DATE_RANGE_YEAR_FORMAT = ['MMMM DD, YYYY', 'MMMM DD, YYYY'];

export const DATE_TIME_FORMAT = 'MMMM DD, YYYY hh:mm A';

export const DATE_RANGE_TIME_FORMAT = ['MMMM DD, YYYY hh:mm A', 'hh:mm A'];
export const DATE_RANGE_DAY_TIME_FORMAT = [
  'MMMM DD hh:mm A',
  'DD, YYYY hh:mm A',
];
export const DATE_RANGE_MONTH_TIME_FORMAT = [
  'MMMM DD hh:mm A',
  'MMMM DD, YYYY hh:mm A',
];
export const DATE_RANGE_YEAR_TIME_FORMAT = [
  'MMMM DD, YYYY hh:mm A',
  'MMMM DD, YYYY hh:mm A',
];

export const AGE_OF_MAJORITY = 18;

export const AUDIT_LOG_CONSTANT = {
  common: {
    updatedBy: 'Update By',
    isAdminUpdated: 'Admin Updated',
    transcationId: 'Transaction id',
    ipAddress: 'Ip address',
  },
  orders: {
    transcationId: 'Transaction id',
    ipAddress: 'Ip address',
  },
  event: {
    endDate: 'End Date',
    name: 'Event Name',
    startDate: 'Start Date',
    teamCap: 'Course Capacity',
    teamGoal: 'Sell To Cap',
    blackloopTeamGoal: 'Blackloop Sell To Cap',
    teamNameChange: 'Team Name/Shirt/Pace Deadline',
    lateFee10: 'Late Invite Fee1 Start',
    lateFee10Amount: 'Late Invite Fee1 Amount',
    lateFee20: 'Late Invite Fee2 Start',
    lateFee20Amount: 'Late Invite Fee2 Amount',
    raceId: 'Race',
    raceYear: 'Race Year',
    teamFreezeDate: 'Roster Freeze Deadline',
    isLive: 'Live',
  },
  prices: {
    registrationOpen: 'Registration Open',
    registrationClose: 'Registration Close',
  },
  shifts: {
    startDate: 'Start Date',
    startTime: 'Start Time',
    endDate: 'End Date',
    endTime: 'End Time',
    capacity: 'Capacity',
    private: 'Private',
  },
  jobs: {
    name: 'Job Name',
    location: 'Location Name',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Zip',
    latitude: 'Latitude',
    longitude: 'Longitude',
    description: 'Job Description',
    priority: 'Priority',
    startDate: 'Start Date',
    endDate: 'End Date',
  },
  promocodes: {
    code: 'Promo Code',
    discountNumber: 'Discount',
    usage: 'Usage',
    startDate: 'Start Date',
    endDate: 'End Date',
    description: 'Description',
    chargeFee: `Dont't charge transaction fee`,
    isGlamping: 'Glamping applicable',
    glampingPrice: 'Glamping Price',
    isGlampingApply: 'Add Glamping',
    datePurchased: 'Date Purchased',
    glamping: 'Glamping',
    discountType: 'Discount Type',
  },
  registrations: {
    firstName: 'First Name',
    lastName: 'Last Name',
    role: 'Role',
    bornAt: 'Birth Date',
    phone: 'Phone Number',
    address: 'Address1',
    address2: 'Address2',
    city: 'City',
    state: 'State',
    zipCode: 'ZipCode',
    country: 'Country',
    pace: 'Pace',
    order: 'Order',
    shiftConfirmed: 'Shift Assign',
    tShirtSize: 'Shirt Size',
  },
  teams: {
    paidExemptions: 'Paid Exemptions',
    classification: 'Classification',
    division: 'Division',
    exemptions: 'Manual Exemptions',
    name: 'Team Name',
    startTime: 'Start Time',
    runOption: 'Runner Assignments',
    notes: 'Notes',
    paidVolunteerOptFees: 'Paid Volunteer Opt Out Fees',
    paidLateFeeAmount: 'Paid Late Fee Amount',
    totalLateFeeAmount: 'Total Late Fee Amount',
    volunteerOptFees: 'Volunteer Opt Out Fees',
  },
  'volunteer-req': {
    shiftClose: 'Volunteer Shift Close',
    shiftOpen: 'Volunteer Shift Open',
  },
  users: {
    firstName: 'First Name',
    lastName: 'Last Name',
    dateOfBirth: 'Birth Date',
    phone: 'Phone Number',
    address: 'Address1',
    address2: 'Address2',
    city: 'City',
    state: 'State',
    zipCode: 'ZipCode',
    country: 'Country',
  },
  'user-extended': {
    shirtSize: 'Shirt Size',
    pace: 'Pace',
  },
  form: {
    name: 'Form Title',
    description: 'Form Description',
  },
  customfields: {
    fieldLabel: 'Label',
    fieldRequired: 'Male this Field Required',
  },
  confirmation: {
    name: 'Confirmation Title',
    description: 'Confirmation Text',
  },
  waiver: {
    name: 'Waiver Title',
    description: 'Waiver Body',
  },
  divisions: {
    name: 'Name',
  },
  classifications: {
    name: 'Name',
  },
};

export type EventStatus = 'past' | 'upcoming' | 'ongoing' | 'all';
export type EventType = 'ROAD' | 'TRAIL' | 'SPRINT' | 'SUNSET' | 'TRAIL_SPRINT';

export interface EventFilters {
  status: EventStatus;
  type: EventType | undefined;
  year: number | undefined;
  search: string;
}
