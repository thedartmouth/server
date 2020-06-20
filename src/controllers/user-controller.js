
import { Users } from '../models';

async function getUsers(filters) {
  const results = await Users.find(filters).exec();
  for (let result of results) {
    result = redactUser(result.toObject());
  }
  return results;
}

function removePassword(user) {
  delete user._doc.password;
  return user;
}

function redactUser(user) {
  delete user._doc.created_date;
  delete user._doc.password;
  return user;
}

export default {
  getUsers, removePassword, redactUser,
};
