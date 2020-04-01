import { Injectable, Inject, Logger, RequestTimeoutException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.client.send({ role: 'user', cmd: 'get' }, { username })
      .pipe(
        timeout(5000), 
        catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),)
      .toPromise();

      Logger.log(`User retrieved: ${JSON.stringify({ id: user.id, username: user.username })}`);

      if(compareSync(password, user?.password)) {
        delete user.password;

        return user;
      } 
      return null;
    } catch(e) {
      Logger.log(e);
      throw e;
    }
  }

  async login(user) {
    const payload = { user, sub: user.id};

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
