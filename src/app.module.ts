// src/app.module.ts
import { Module } from '@nestjs/common';
import { AgreementsService } from './agreement/agreement.service';
import { PrismaService } from './database/prisma.service';
import { DropboxSignService } from './dropbox/dropbox.service';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [WebhookModule],
  providers: [AgreementsService, PrismaService, DropboxSignService],
})
export class AppModule {}
