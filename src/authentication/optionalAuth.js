import requireAuth from './requireAuth';

// function that only redirects to requireAuth if a token is found
// otherwise, just call next
// enables the creation of login-optional routes that act differently
// depending on whether the user is logged in
async function optionalAuth(req, res, next) {
  if (req.headers.authorization) requireAuth(req, res, next);
  else next();
}

export default optionalAuth;
