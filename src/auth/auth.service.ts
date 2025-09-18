import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

type SafeUser = {
    id: number;
    email: string;
    name: string;
    organizationId: number;
};

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // Register new user (org-scoped)
    async register(
        email: string,
        password: string,
        name: string,
        organizationId: number,
    ): Promise<SafeUser> {
        // 1) Validate org exists
        const org = await this.prisma.organization.findUnique({
            where: { id: organizationId },
            select: { id: true },
        });
        if (!org) throw new BadRequestException('Organization not found');

        // 2) Prevent duplicate email
        const existing = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        if (existing) throw new ConflictException('Email already in use');

        // 3) Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, password: hashedPassword, name, organizationId },
            select: { id: true, email: true, name: true, organizationId: true },
        });

        return user;
    }

    // Login existing user
    async login(email: string, password: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true, organizationId: true },
        });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            sub: user.id,
            email: user.email,
            organizationId: user.organizationId,
        };
        return this.jwtService.sign(payload);
    }
}
