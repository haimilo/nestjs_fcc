import { ConfigService } from '@nestjs/config';
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
    Strategy,
    ExtractJwt,
} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt',
) {
    constructor(
        private config: ConfigService,
    ) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            // ignoreExpiration: false,
            // secretOrKey: process.env.JWT_SECRET,
            secretOrKey: config.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
