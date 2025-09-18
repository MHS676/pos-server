import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category.input';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) { }

    async getCategories(organizationId: number) {
        return this.prisma.category.findMany({
            where: { organizationId },
            include: { products: true },
        });
    }

    async createCategory(organizationId: number, data: CreateCategoryInput) {
        return this.prisma.category.create({
            data: { ...data, organizationId },
        });
    }
}
