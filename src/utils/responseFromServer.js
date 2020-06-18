const responseFromServer = async (url,
  notification = { msg: '', status: null },
  method = 'GET', userData = null) => {
  let setNotification = notification;
  let response;
  if (method === 'POST') {
    response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  } else {
    response = await fetch(url);
  }
  if (!response.ok) {
    setNotification = { msg: `${response.statusText}: ${response.status}`, status: false };
  }

  const data = await response.json();
  return { data, notification: setNotification };
};

export default responseFromServer;
