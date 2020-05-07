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
  delete user.owned_listings;

  delete user.account_approved;
  delete user.account_suspended;
  delete user.suspension_message;
  delete user.password;
  return user;
}

function getListingUser(user) {
  delete user.created_date;
  delete user.owned_listings;

  delete user.account_location;
  delete user.account_description;

  delete user.account_tags;
  delete user.is_admin;

  delete user.secondary_contact;
  delete user.secondary_phone_number;
  delete user.secondary_contact_email;
  delete user.secondary_website_url;

  delete user.account_approved;
  delete user.account_suspended;
  delete user.suspension_message;
  delete user.password;
  return user;
}

const userController = {
  tokenForUser, removePassword, redactUser, getListingUser,
};

export default userController;
