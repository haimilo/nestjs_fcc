/* eslint-disable prettier/prettier */
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async signup(dto: AuthDto) {
    // Thực hiện generate password hash
    const hash = await argon.hash(dto.password);
    // Thực hiện lưu vào database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        }
      })
      // Thực hiện return user
      console.log(user);
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // throw new BadRequestException('Email đã tồn tại');
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email đã tồn tại trong hệ thống');
          // throw new BadRequestException('Email đã tồn tại');
        }
      }
      throw error;
    }
  }

  signin() {
    return {
      msg: 'I am signed in!',
    };
  }
}
