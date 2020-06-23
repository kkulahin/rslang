const responseFromServer = async (url,
  token = null,
  notification = { msg: '', status: null },
  method = 'GET', userData = null) => {
  let setNotification = notification;
  let headers = {
    Accept: 'application/json',
  };
  if (token !== null) {
    headers = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };
  }
  if (method !== 'GET') {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
    };
  }

  let params = {
    method,
    withCredentials: token !== null,
    headers,
  };

  if (method !== 'GET') {
    params = {
      ...params,
      body: JSON.stringify(userData),
    };
  }
  const response = await fetch(url, params);

  if (!response.ok) {
    setNotification = { msg: `${response.statusText}: ${response.status}`, status: false };
  }

  const data = await response.json();
  return { data, notification: setNotification };
};

export default responseFromServer;
