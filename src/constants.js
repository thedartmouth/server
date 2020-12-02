import packageInfo from '../package.json';

export const MONGODB_URI = process.env.MONGODB_URI || packageInfo.localDatabaseURI;
export const SELF_URL = process.env.NODE_ENV === 'development' ? `localhost:${9090}` : packageInfo.productionURL;
export const APP_URL = process.env.NODE_ENV === 'development' ? `localhost:${8080}` : packageInfo.productionClientURL;

export const USER_STRING = 'organization';

export const UNPROTECTED_USER_FIELDS = [
  // Need to be verified, TODO
  // 'email',
  // 'password',
];
