const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i = +1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

function setCookie(name, value, time) {
  let expires = '';
  if (time) {
    const date = new Date();
    date.setTime(date.getTime() + (time));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

const deleteCookie = (name) => {
  setCookie(name, '', {
    'max-age': -1,
  });
};

export { getCookie, setCookie, deleteCookie };
