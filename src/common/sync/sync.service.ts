import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SyncService {
    constructor(private prisma: PrismaService) { }

    async syncUsers(organizationId: number) {
        try {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');

            const users = data.map((u: any) => ({
                name: u.name,
                email: u.email,
                organizationId,
            }));

            for (const user of users) {
                const exists = await this.prisma.user.findUnique({ where: { email: user.email } });
                if (!exists) await this.prisma.user.create({ data: user });
            }

            return `Synced ${users.length} users`;
        } catch {
            throw new HttpException('Failed to sync users', 500);
        }
    }

    async syncCategories(organizationId: number) {
        try {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');

            const categories = data.map((p: any) => ({
                name: p.title.substring(0, 20),
                description: p.body.substring(0, 50),
                organizationId,
            }));

            for (const cat of categories) {
                const exists = await this.prisma.category.findFirst({
                    where: { name: cat.name, organizationId },
                });
                if (!exists) await this.prisma.category.create({ data: cat });
            }

            return `Synced ${categories.length} categories`;
        } catch {
            throw new HttpException('Failed to sync categories', 500);
        }
    }
}
