import packageInfo from '../package.json';

export const PORT = process.env.PORT || 9090;
export const MONGODB_URI = process.env.MONGODB_URI || packageInfo.localDatabaseURI;
export const SELF_URL = process.env.NODE_ENV === 'development' ? `localhost:${9090}` : packageInfo.productionURL;
export const APP_URL = process.env.NODE_ENV === 'development' ? `localhost:${8080}` : packageInfo.productionClientURL;
