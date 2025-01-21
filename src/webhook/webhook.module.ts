import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DropboxSignService } from '../dropbox/dropbox.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService, DropboxSignService],
  exports: [WebhookService],
})
export class WebhookModule {}
