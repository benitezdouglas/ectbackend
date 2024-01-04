import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.client.user.create({ data: user });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prismaService.client.user.findUnique({
      where: { id },
      include: { revokedTokens: true, loginAttempts: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return this.prismaService.client.user.findMany();
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<User> {
    const existingUser = await this.prismaService.client.user.findUnique({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prismaService.client.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prismaService.client.user.delete({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
