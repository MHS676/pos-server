import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret', 
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, AuthResolver, PrismaService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
