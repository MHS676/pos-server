import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getUsers(organizationId: number) {
        // include removed to match GraphQL fields
        return this.prisma.user.findMany({
            where: { organizationId },
            select: { id: true, email: true, name: true },
        });
    }

    async getUserById(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, name: true, organizationId: true },
        });
    }
}
