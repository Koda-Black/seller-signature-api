import { Module } from '@nestjs/common';
import { AgreementsService } from '../agreement/agreement.service';
import { AgreementsController } from '../agreement/agreement.controller';
import { DropboxSignService } from '../dropbox/dropbox.service';
import { DropboxModule } from '../dropbox/dropbox.module';
import { PrismaModule } from '../database/prisma.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [PrismaModule, DropboxModule],
  controllers: [AgreementsController],
  providers: [AgreementsService, PrismaService, DropboxSignService],
})
export class AgreementsModule {}
