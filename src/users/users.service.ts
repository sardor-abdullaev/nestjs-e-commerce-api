import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
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
  ) { }

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

  create(login: string, password: string) {
    const user = this.userRepo.create({ login, password });
    return this.userRepo.save(user);
  }

  findOne(id: string) {
    if (!id) {
      return null;
    }
    return this.userRepo.findOneBy({ id });
  }

  findByLogin(login: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { login } });
  }

  async findAll() {
    return this.userRepo.find();
  }

  async update(id: string, attr: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attr);
    return this.userRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepo.findBy({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepo.remove(user);
  }


}
