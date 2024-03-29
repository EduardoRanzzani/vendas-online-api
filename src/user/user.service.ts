import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from './enum/user-type.enum';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDTO: Prisma.UserCreateInput): Promise<User> {
    const user = await this.findByEmail(createUserDTO.email).catch(
      () => undefined,
    );

    if (user) {
      throw new ConflictException('User already exists');
    }

    const saltOrRounds = 10;
    const passwordHashed = await hash(createUserDTO.password, saltOrRounds);

    return this.prisma.user.create({
      data: {
        ...createUserDTO,
        typeUser: UserType.USER,
        password: passwordHashed,
      },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new NotFoundException('No User found');
    }
    return users;
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        addresses: {
          include: {
            city: {
              include: { state: true },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        addresses: {
          include: {
            city: {
              include: { state: true },
            },
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async update(
    id: number,
    updateUserDTO: Prisma.UserUpdateInput,
  ): Promise<User> {
    await this.findById(id);
    return this.prisma.user.update({ where: { id }, data: updateUserDTO });
  }

  async delete(id: number): Promise<User> {
    await this.findById(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
