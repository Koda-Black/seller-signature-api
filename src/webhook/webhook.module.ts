import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DropboxSignService } from '../dropbox/dropbox.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhookController],
  providers: [WebhookService, DropboxSignService, MailService],
  exports: [WebhookService],
})
export class WebhookModule {}
