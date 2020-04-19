import jwt from 'jwt-simple';

// import User from '../models/user_model';

// eslint-disable-next-line import/prefer-default-export
export function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
