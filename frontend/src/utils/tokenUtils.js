

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  if (!storedExpirationDate) {
    return 0;
  }
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate - now;
  return Number.isFinite(duration) ? duration : 0;
}


export function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    return null
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return 'EXPIRED';
  }
  return token
}


export function tokenLoader() {
  const token = getAuthToken();
  return token;
}

