import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AgreementsModule } from './agreement/agreement.module';
import { WebhooksModule } from './webhook/webhook.module';

@Module({
  imports: [PrismaModule, AgreementsModule, WebhooksModule],
})
export class AppModule {}
