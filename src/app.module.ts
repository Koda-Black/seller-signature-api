import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgreementsModule } from './agreement/agreement.module';
import { DropboxModule } from './dropbox/dropbox.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WebhookModule,
    AgreementsModule,
    DropboxModule,
  ],
})
export class AppModule {}
