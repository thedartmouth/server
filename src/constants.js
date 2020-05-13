import packageInfo from '../package.json';

export const PORT = process.env.PORT || 9090;
export const MONGODB_URI = process.env.MONGODB_URI || packageInfo.localDatabaseURI;
export const SELF_URL = process.env.NODE_ENV === 'development' ? `localhost:${9090}` : packageInfo.productionURL;
export const APP_URL = process.env.NODE_ENV === 'development' ? `localhost:${8080}` : packageInfo.productionClientURL;

export const USER_STRING = 'organization';

export const UNPROTECTED_USER_FIELDS = [
  // Need to be verified, TODO
  // 'email',
  // 'password',

  'profile_photo_url',
  'account',
  'account_location',
  'account_description',

  'primary_contact',
  'primary_phone_number',
  'primary_contact_email',

  'secondary_contact',
  'secondary_phone_number',
  'secondary_contact_email',
  'secondary_website_url',
];

export const FRONTEND_FILTERS = {
  length: [
    'Less than 1 month',
    '1-6 months',
    '11 months',
    '1 year',
    'Greater than 1 year',
    'No set end',
  ],

  weeklyCommit: [
    'Less than weekly',
    '1-4 hours',
    '4-10 hours',
    '10-35 hours',
    '35-40 hours',
  ],

  age: [
    'None',
    '16+ years',
    '18+ years',
  ],

  education: [
    'None',
    'Some high school',
    'High school diploma',
    'Some college',
    'College diploma',
  ],

  focus: [
    'Animals',
    'Children / Education',
    'Community Outreach',
    'Disaster Relief',
    'Environment',
    'Health',
    'Housing',
    'Hunger',
    'Legal',
    'Seniors',
    'Technology',
    'Veterans',
  ],
};
