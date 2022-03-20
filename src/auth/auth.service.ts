/* eslint-disable prettier/prettier */
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }
  async signup(authDto: AuthDto) {
    // Thực hiện generate password hash
    const hash = await argon.hash(authDto.password);
    // Thực hiện lưu vào database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: authDto.email,
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
      return this.signToken(user.id, user.email);
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

  async signin(authDto: AuthDto) {
    // Tìm ra user theo email
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    // Nếu như không tìm thấy user
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    // Kiểm tra password có đúng hay không
    const valid = await argon.verify(user.hash, authDto.password);
    if (!valid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }
    // Nếu như password đúng thì return user
    return this.signToken(user.id, user.email);
  }

  // Hàm tạo token authentication
  async signToken(userId: number, email: string):
    Promise<{ access_token: string }> {
    // payload là thông tin của user
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    // Trả về token đã được tạo ra với payload và secret key đã được định nghĩa trong file config
    const token = await this.jwt.signAsync(payload, {
      // Gửi cho người dùng token có giá trị đăng nhập trong vòng 15p'
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    }
  }
}
