import { Injectable, Inject, Logger } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.client.send({ role: 'user', cmd: 'get' }, { username }).toPromise();

      if(compareSync(password, user?.password)) {
        delete user.password;

        return user;
      } 
      return null;
    } catch(e) {
      Logger.log(e);
      return null;
    }
  }

  async login(user) {
    const payload = { user, sub: user.id};

    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}
