import jwt from 'jwt-simple';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

function removePassword(user) {
  delete user.password;
  return user;
}

function redactUser(user) {
  delete user.created_date;
  delete user.account_approved;
  delete user.account_suspended;
  delete user.suspension_message;
  delete user.password;
  return user;
}

const userController = {
  tokenForUser, removePassword, redactUser,
};

export default userController;
