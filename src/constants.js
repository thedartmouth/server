export const PORT = process.env.PORT || 9090;
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/granite-state';
export const SELF_URL = process.env.NODE_ENV === 'development' ? `localhost:${9090}` : 'https://www.google.com';
export const APP_URL = process.env.NODE_ENV === 'development' ? `localhost:${8080}` : 'https://d-planner.com';
