import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { AdminAuthController } from './admin_auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
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
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
