import crypto from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');
  return await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...options,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...options,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    ...options,
    maxAge: ONE_DAY,
  });
};