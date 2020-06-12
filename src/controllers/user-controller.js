
import { Users } from '../models';

async function getUsers(filters) {
  const results = await Users.find(filters).exec();
  for (let result of results) {
    result = redactUser(result.toObject());
  }
  return results;
}


function removePassword(user) {
  delete user.password;
  return user;
}

function redactUser(user) {
  delete user.created_date;
  delete user.password;
  return user;
}

export default {
  getUsers, removePassword, redactUser,
};
