import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    const adminLogin = this.configService.get('ADMIN_LOGIN');
    const admin = await this.userRepo.findOne({ where: { login: adminLogin } });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(
        this.configService.get('ADMIN_PASSWORD'),
        10,
      );
      const newAdmin = this.userRepo.create({
        login: adminLogin,
        password: hashedPassword,
        role: 'admin',
      });

      await this.userRepo.save(newAdmin);
      console.log('Default admin user created.');
    } else {
      console.log('Default admin user already exists.');
    }
  }
}
