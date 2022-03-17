/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        //super sẽ gọi đến các hàm của class cha PrismaClient
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                }
            }
        });
    }
}
