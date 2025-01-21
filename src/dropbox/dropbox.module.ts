import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DropboxSignService } from './dropbox.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [ConfigModule, DropboxSignService, PrismaService],
  exports: [DropboxSignService],
})
export class DropboxModule {}
