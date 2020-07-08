const URL = 'http://localhost:3000';
const CLIENT_ID = '0oae3wup7FHa8RNBG4x6';
// const ISSUER = 'https://dev-192556.okta.com';
const ISSUER = 'https://dev-192556.okta.com/oauth2/default';
export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: `${URL}/implicit/callback`
  }
};
