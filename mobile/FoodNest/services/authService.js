import { apiPost } from './apiClient';

// Matches server/Routes/CreateUser.js exactly.
// User model (server/models/User.js) requires: name, email, password, location.
// There is no "get current user" endpoint on the backend, so the mobile app
// cannot re-fetch a profile from the server after login — see README
// "Known Backend Limitations" for how this is handled.

export async function signup({ name, email, password, location }) {
  const json = await apiPost('/createuser', { name, email, password, location });
  return json; // { success: boolean, errors?: [...] }
}

export async function login({ email, password }) {
  const json = await apiPost('/loginuser', { email, password });
  return json; // { success: boolean, authToken?: string, errors?: string }
}

export default { signup, login };
