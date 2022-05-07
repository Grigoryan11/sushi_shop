import { HttpException, Injectable } from '@nestjs/common';
import { AdminDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';
import { email, password } from './admin.json';
import { JwtService } from '@nestjs/jwt';
import { Change_passwordDto } from './dto/changePassword.dto';

import fs from 'fs';
import * as path from 'path';
import file from './admin.json';
import { MailerService } from '@nestjs-modules/mailer';
import { forgotPasswordDto } from './dto/forgotPassword.dto';

const currentDir = path.resolve();
const payload = {
  email: email,
};
const secretKey = 'secret';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(admin: AdminDto) {
    const isMatch = await bcrypt.compare(admin.password, password);
    if (email == admin.email && isMatch) {
      const token = this.jwtService.sign({ payload }, { secret: secretKey });
      return {
        message: 'Success',
        data: {
          token: token,
        },
      };
    } else {
      throw new HttpException('Invalid email or password', 401);
    }
  }

  async changePassword(admin: Change_passwordDto) {
    const isMatch = await bcrypt.compare(admin.oldPassword, password);
    if (isMatch) {
      if (admin.newPassword === admin.confirmPassword) {
        const hash = await bcrypt.hash(admin.newPassword, 10);
        file.password = hash;
        fs.writeFile(
          path.join(currentDir, 'src/admin_auth/admin_auth.json'),
          JSON.stringify(file),
          (err) => {
            if (err) return err;
            else {
              console.log('File written successfully\n');
            }
          },
        );
        return {
          message: 'Success',
        };
      } else
        throw new HttpException(
          'new password and confirm password is not Match',
          401,
        );
    } else throw new HttpException('old password is not correct', 401);
  }
  async sent_email_forgot_password() {
    const token = this.jwtService.sign({ payload }, { secret: secretKey });
    try {
      await this.mailerService.sendMail({
        to: payload.email,
        from: payload.email,
        subject: `Message from WebSite( Forgot Password )`,
        html: `<h2>Forgot your password ❓❗</h2><br><h3>Don't worry, you can restore it by clicking on this link</h3> <h3><a href="http://localhost:3001/recower-password?code=${token}">Restore password</a></h3>`,
      });
      return {
        message: 'success',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async forgot_password(admin: forgotPasswordDto) {
    if (admin.new_pass === admin.confirm_pass) {
      const hash = await bcrypt.hash(admin.new_pass, 10);
      file.password = hash;
      fs.writeFile(
        path.join(currentDir, 'src/admin_auth.json'),
        JSON.stringify(file),
        (err) => {
          if (err) console.log(err);
          else {
            console.log('File written successfully\n');
          }
        },
      );
      return {
        message: 'Success',
      };
    } else
      throw new HttpException(
        'new password and confirm password is not Match',
        401,
      );
  }
}
