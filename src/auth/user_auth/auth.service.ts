import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { userEntity } from '../../db/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { signInDto, signUpDto } from './dto/auth.dto';
import { CodeInterface, JwtInterface } from './interface/jwt.interface';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ChangeUserPasswordDto } from './dto/changeUserPassword.dto';
import { MailerService } from '@nestjs-modules/mailer';
import {
  forgotPasswordDto,
  sentEmailForgotPassword,
} from './dto/forgotPassword.dto';
import { ChangeDataDto } from "./dto/changeData.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepo: Repository<userEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async createUser(payload: signUpDto) {
    const user = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      const data: JwtInterface = {
        email: payload.email,
      };
      if (payload.password === payload.confirmPassword) {
        payload.password = bcrypt.hashSync(payload.password, 10);
        const token = this.jwtService.sign(data);
        await this.userRepo.save(payload);
        await this.mailerService.sendMail({
          to: payload.email,
          from: 'admin',
          subject: `Message from WebSite( Activation Account ) ✔`,
          html: `<h2>Your email is't active</h2><br><h3>Please click here for activating your account 😁 </h3> <h3><a href="http://localhost:3001/activation-account/${token}">Activating account</a></h3>`,
        });
        return {
          message: 'Please check your email!!!',
          token: token,
        };
      } else {
        throw new HttpException(
          'Password and confirm-password do not match',
          400,
        );
      }
    }
    throw new HttpException('User with that email already exists', 400);
  }

  async confirmEmail(data: CodeInterface) {
    const decoded = this.jwtService.decode(data.data) as JwtInterface;
    const user = await this.userRepo.findOne({
      where: {
        email: decoded.email,
      },
    });
    if (user && user.isActive == false) {
      user.isActive = true;
      await this.userRepo.save(user);
      return {
        message: 'User is success activating!!!',
      };
    } else {
      return {
        message: 'User is already active!!!',
      };
    }
  }

  async userSignIn(payload: signInDto) {
    const user = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new HttpException('Invalid email or password', 401);
    }
    if (user && user.isActive == false) {
      const data: JwtInterface = {
        email: payload.email,
      };
      const token = this.jwtService.sign(data);
      await this.mailerService.sendMail({
        to: payload.email,
        from: 'admin',
        subject: `Message from WebSite( Activation Account ) ✔`,
        html: `<h2>Your email is't active</h2><br><h3>Please click here for activating your account 😁 </h3> <h3><a href="http://localhost:3001/activation-account/${token}">Activating account</a></h3>`,
      });
      return {
        message: 'Please check your email!!!',
        token: token,
      };
    }
    if (user && user.isActive == true) {
      if (user && bcrypt.compareSync(payload.password, user.password)) {
        const token = this.jwtService.sign({
          id: user.id,
          email: user.email,
        });

        return {
          message: 'Success',
          data: {
            token: token,
          },
        };
      } else {
        throw new HttpException('Invalid email or password', 401);
      }
    } else {
      throw new HttpException('User is not active', 401);
    }
  }
  async changeUserPassword(
    currentUser: userEntity,
    payload: ChangeUserPasswordDto,
  ) {
    const user = await this.userRepo.findOne({
      where: {
        email: currentUser.email,
      },
    });
    const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
    if (isMatch) {
      if (payload.newPassword === payload.confirmPassword) {
        payload.newPassword = bcrypt.hashSync(payload.newPassword, 10);
        user.password = payload.newPassword;
        const update = await this.userRepo.save(user);
        if (update) {
          return {
            message: 'success',
          };
        }
      } else {
        throw new HttpException(
          'Invalid new password or confirm password!',
          401,
        );
      }
    } else {
      throw new HttpException('Invalid old password!', 401);
    }
  }

  async sent_email_forgot_password(payload: sentEmailForgotPassword) {
    const token = this.jwtService.sign({ email: payload.email });
    const user = await this.userRepo.findOne({
      where: {
        email: payload.email,
      },
    });
    try {
      if (user) {
        await this.mailerService.sendMail({
          to: payload.email,
          from: 'admin',
          subject: `Message from WebSite( Forgot Password ) ✔`,
          html: `<h2>Forgot your password ❓❗</h2><br><h3>Don't worry, you can restore it by clicking on this link 😁 </h3> <h3><a href="http://localhost:3001/forgot-password/${token}">Restore password</a></h3>`,
        });
        return {
          message: 'success',
          token: token,
        };
      } else {
        return {
          message: 'Invalid email',
        };
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async forgot_password(payload: forgotPasswordDto) {
    const decoded = this.jwtService.decode(payload.data) as JwtInterface;
    const user = await this.userRepo.findOne({
      where: {
        email: decoded.email,
      },
    });
    if (payload.new_pass === payload.confirm_pass) {
      const hash = await bcrypt.hash(payload.new_pass, 10);
      user.password = hash;
      await this.userRepo.save(user);
      return {
        message: 'Success',
      };
    } else
      throw new HttpException(
        'new password and confirm password is not Match',
        401,
      );
  }

  // async changeDataUser(currentUser, payload: ChangeDataDto) {
  //   const user = await this.userRepo.findOne({
  //     where: {
  //       email: currentUser.email,
  //     },
  //   });
  //   if (!user) {
  //     throw new HttpException('User not found!!!', 404);
  //   }
  //   const data = await this.userRepo.update({ id }, payload);
  //   if (data && data.affected > 0) {
  //     return {
  //       message: 'success',
  //       data: data,
  //     };
  //   }
  //   return {
  //     message: 'Data not updated',
  //     data: [],
  //   };
  // }
}
