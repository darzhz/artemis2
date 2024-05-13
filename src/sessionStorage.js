const sessionStore = {};

export function getSessionData(sessionId) {
  return sessionStore[sessionId] || {};
}

export function setSessionData(sessionId, data) {
  sessionStore[sessionId] = data;
}

export async function getSession(request) {
    const session = request.locals.session;
  
    // Ensure session ID is set
    if (!session.has('sessionId')) {
      const sessionId = generateSessionId(); // Generate a session ID
      session.set('sessionId', sessionId);
    }
  
    return session;
  }