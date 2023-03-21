const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const jwtCheck = auth({
  secret: "QKjvxwSAB9dKiO5Buyyr7lfmTJdRvOcO",
  audience: "this is a unique identifier viator final 2",
  issuerBaseURL: "https://dev-cz6i21an2opri7kv.us.auth0.com/",
  tokenSigningAlg: "HS256",
});

const checkScopes = requiredScopes("admin");

module.exports = {
  jwtCheck,
  checkScopes,
};