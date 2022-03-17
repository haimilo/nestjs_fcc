/* eslint-disable prettier/prettier */
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {
  
  }
  signin() {
    return {
      msg: 'I am signed in!',
    };
  }

  signup() {
    
    return {
      msg: 'I am signed up!',
    };
  }
}
