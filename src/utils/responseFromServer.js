const responseFromServer = async (url, method = 'GET', userData = null) => {
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

  const data = await response.json();
  return data;
};

export default responseFromServer;
