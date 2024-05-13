import { getSessionData } from './sessionStorage.js';
import { user } from './stores/auth.js';

export async function beforePageLoad({ session }) {
  const sessionId = session.get('sessionId');
  const sessionData = getSessionData(sessionId);
  user.set(sessionData.user);
}