// src/agreements/agreements.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AgreementDto } from './dto/agreement.dto';
import { DropboxSignService } from '../dropbox/dropbox.service';

@Injectable()
export class AgreementsService {
  constructor(
    private prisma: PrismaService,
    private dropboxSignService: DropboxSignService,
  ) {}

  async createAgreement(data: AgreementDto) {
    const newAgreement = await this.prisma.agreement.create({ data });

    // Call Dropbox Sign service to create an embedded signature request
    const templateFields = {
      sellerSign: data.sellerSign,
      sellerName: data.sellerName,
      agreementDate: data.agreementDate,
      agreementAmount: data.agreementAmount,
      duration: data.duration,
      extensionPeriod: data.extensionPeriod,
      extensionAmount: data.extensionAmount,
      propertyLocation: data.propertyLocation,
    };

    const signatureRequest =
      await this.dropboxSignService.createEmbeddedSignatureRequest(
        templateFields,
      );

    // Save Dropbox Sign data to the database (optional)
    const documentData = {
      agreementId: newAgreement.id,
      signatureRequestId: signatureRequest.signature_request_id,
      status: signatureRequest.status,
    };
    await this.prisma.documentInstance.create({ data: documentData });

    // Send a copy of the signed document to the user (email or PDF processing can be added here)
    return newAgreement;
  }

  async getAgreements() {
    return this.prisma.agreement.findMany();
  }

  async storeDocumentInstance(documentData: any) {
    return this.prisma.documentInstance.create({ data: documentData });
  }
}
