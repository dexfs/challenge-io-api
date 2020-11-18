import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import IUserToken from '@app/interfaces/IUserToken';

class TokenService {
  generate(subject: IUserToken): string {
    const { secret, expiresIn } = authConfig.jwt;
    const { username, mobileToken, id } = subject;
    const token = sign({ user: { username, mobileToken, id } }, secret, {
      expiresIn,
    });

    return token;
  }
}

export default TokenService;
