export const environment = {
  production: false,
  debug: false,
  registrationsConfigBaseUrl:
    'https://w8qa19wzzc.execute-api.us-west-2.amazonaws.com/dev' /* FOR EVENTS [DASHBOARD, EVENT] */,
  promoCodesBaseUrl:
    'https://04xnri92d3.execute-api.us-west-2.amazonaws.com/dev' /* FOR PROMOCODES [PROMOCODE] */,
  registrationsBaseUrl:
    'https://v1mzzpsgi8.execute-api.us-west-2.amazonaws.com/dev' /* REGISTER USER LIKE PARTICIPATE/ RUNNERS ETC */,
  jobsBaseUrl:
    'https://64bqow622d.execute-api.us-west-2.amazonaws.com/dev' /* VOLUNTEER INFOEMARION EVENT DETAIL PAGE*/,
  teamsBaseUrl:
    'https://ewbpf5e4g9.execute-api.us-west-2.amazonaws.com/dev' /* CLASSIFICATION / DIVISION */,
  usersBaseUrl:
    'https://v6bonklej1.execute-api.us-west-2.amazonaws.com/dev' /* FOR USERS OF HUB */,
  customFieldsBaseUrl:
    'https://clgrn9ximh.execute-api.us-west-2.amazonaws.com/dev/custom-fields' /* DONE */,
  reportingBaseUrl:
    'https://pbtw13194i.execute-api.us-west-2.amazonaws.com/dev' /* FOR THE REPORTING PURPOSE */,
  runnerBaseUrl:
    'https://aasbjrt7x9.execute-api.us-west-2.amazonaws.com/staging',
  teamCenterBaseUrl:
    'https://hdqfqtb7zd.execute-api.us-west-2.amazonaws.com/dev' /* REMAIN FOR [[[ INVITE SERVICE ]]] */,
  profilesBaseUrl:
    'https://ldsgfpvjt5.execute-api.us-west-2.amazonaws.com/dev' /* REMAIN */,

  profilesApiKey:
    'b7f5361ab446b480f62d2774ef174b30c4f2e5ae109758382ce300037e6d80eaaaefba0621ef046f2d3b0ed0',
  apiKey:
    'b7f5361ab446b480f62d2774ef174b30c4f2e5ae109758382ce300037e6d80eaaaefba0621ef046f2d3b0ed0',

  /* ISFOR: PAYMENT API */
  authorizeNet: {
    clientKey:
      '7c9979cfvbBFS8Mrg7FVK434vFV4N3q25jpw92R48k4HSWDP9YBKUyPkCVA56hJp',
    apiLoginID: '4pF36MN3nQU6',
  },
  /* ISFOR: PROFILE MANAGEMENT WHICH IS SEPERATE API */
  adminCognitoRegion: 'us-west-2',
  adminCognitopoolId: 'us-west-2_fZCEM2UUM',
  adminCognitoClientId: '15l159fouaa4298jpfv9o41c4p',

  hubAdminBaseUrl: 'https://dev-admin-registration.runragnar.com/index.html/',
  hubUserBaseUrl: 'https://dev-registration.runragnar.com/index.html/',
  domesticBaseUrl: 'https://dev.runragnar.com/teamcenter-dev',
};
