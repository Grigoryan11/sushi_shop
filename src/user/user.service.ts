import { Injectable } from '@nestjs/common';
import { signInDto } from '../auth/user_auth/dto/auth.dto';
import { Repository } from 'typeorm';
import { userEntity } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepo: Repository<userEntity>,
  ) {}
  async findByPayload(email): Promise<signInDto> {
    return await this.userRepo.findOne({
      where: { email: email.email },
    });
  }
}
