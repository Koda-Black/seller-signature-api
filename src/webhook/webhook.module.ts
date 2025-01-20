// src/webhooks/webhook.module.ts
import { Module } from '@nestjs/common';
import { WebhooksController } from './webhook.controller';
import { DropboxSignService } from '../dropbox/dropbox.service';

@Module({
  controllers: [WebhooksController],
  providers: [DropboxSignService],
})
export class WebhookModule {}
