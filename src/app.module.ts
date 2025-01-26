import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgreementsModule } from './agreement/agreement.module';
import { DropboxModule } from './dropbox/dropbox.module';
import { WebhookModule } from './webhook/webhook.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WebhookModule,
    AgreementsModule,
    DropboxModule,
    MailModule,
  ],
})
export class AppModule {}
