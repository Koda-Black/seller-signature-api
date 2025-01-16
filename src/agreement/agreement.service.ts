import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AgreementDto } from './dto/agreement.dto';

@Injectable()
export class AgreementsService {
  constructor(private prisma: PrismaService) {}

  async createAgreement(data: AgreementDto) {
    const newAgreement = await this.prisma.agreement.create({ data });
    return newAgreement;
  }

  async getAgreements() {
    return this.prisma.agreement.findMany();
  }

  async storeDocumentInstance(documentData: any) {
    return this.prisma.documentInstance.create({ data: documentData });
  }
}
