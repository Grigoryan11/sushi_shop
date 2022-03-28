import { Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from '../../db/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
import { JwtStrategy } from '../jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
dotenv.config({ path: __dirname + '/.env' });

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([userEntity]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        algorithm: 'HS256',
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 465,
        secure: true,
        service: 'Gmail',
        auth: {
          user: 'sam.grigoryan.17@gmail.com',
          pass: 'grig-2000',
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class authModule {}
