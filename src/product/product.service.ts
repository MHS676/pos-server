import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async getProducts(organizationId: number) {
        return this.prisma.product.findMany({
            where: { organizationId },
            include: { category: true },
        });
    }

    async createProduct(data: CreateProductInput & { organizationId: number }) {
        return this.prisma.product.create({
            data,
        });
    }
}
