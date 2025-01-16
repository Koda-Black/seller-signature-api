import { Module } from '@nestjs/common';
import { AgreementsService } from '../agreement/agreement.service';
import { AgreementsController } from '../agreement/agreement.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AgreementsController],
  providers: [AgreementsService],
})
export class AgreementsModule {}
