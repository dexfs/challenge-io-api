import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import IUserToken from '@app/interfaces/IUserToken';

interface IToken {
  user: IUserToken;
}
const decodeToken = (token: string) => {
  return verify(token, authConfig.jwt.secret);
};

const isAuthorized = (
  request: Request,
  response: Response,
  next: NextFunction,
): Response | undefined => {
  const requestToken = request.headers.authorization;

  if (!requestToken) {
    return response.status(401).json({ message: 'Missing token.' });
  }

  try {
    const [, token] = requestToken.split(' ');
    const decoded = decodeToken(token) as IToken;
    request.user = decoded.user;
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid token!' });
  }
};

export default isAuthorized;
