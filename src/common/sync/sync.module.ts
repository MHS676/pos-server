import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncResolver } from './sync.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [SyncService, SyncResolver],
})
export class SyncModule { }
