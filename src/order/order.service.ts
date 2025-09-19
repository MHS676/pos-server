import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService) { }

    async getOrders(organizationId: number) {
        return this.prisma.order.findMany({
            where: { user: { organizationId } },
            include: { product: true, user: true },
        });
    }

    async placeOrder(userId: number, productId: number, quantity: number) {
        if (quantity <= 0) throw new BadRequestException('Quantity must be > 0');

        const [product, user] = await Promise.all([
            this.prisma.product.findUnique({ where: { id: productId } }),
            this.prisma.user.findUnique({
                where: { id: userId },
                select: { organizationId: true },
            }),
        ]);

        if (!user) throw new BadRequestException('User not found');
        if (!product) throw new BadRequestException('Product not found');
        if (product.organizationId !== user.organizationId) {
            throw new BadRequestException('Product not in your organization');
        }
        if (product.stock < quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        const totalPrice = product.price * quantity;

        const order = await this.prisma.order.create({
            data: { userId, productId, quantity, totalPrice },
        });

        await this.prisma.product.update({
            where: { id: productId },
            data: { stock: { decrement: quantity } },
        });

        return order;
    }
}
