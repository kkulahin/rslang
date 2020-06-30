import { SchoolURL } from '../../config/default';
import responseFromServer from '../../utils/responseFromServer';

const UserNotification = {
  msg: 'User get successfully',
  status: true,
};

const UserAuthFailMsg = {
  msg: 'Incorrect e-mail or password',
  status: false,
};

const UserCreatedMsg = {
  msg: 'User created successfully. You will be redirected',
  status: true,
};

const createUser = async (data, notification = UserNotification) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/signin`, notification, 'POST', data);
    return response;
  } catch (error) {
    const failResponse = {
      data: null,
      notification: UserAuthFailMsg,
    };
    return failResponse;
  }
};

const isAuthUser = async (data, notification = UserCreatedMsg) => {
  try {
    const response = await responseFromServer(`${SchoolURL}/users`, notification, 'POST', data);
    return response;
  } catch (error) {
    throw new Error('invalid request');
  }
};

export { createUser, isAuthUser };
