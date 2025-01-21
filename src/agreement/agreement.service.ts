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

    // Prepare data for Dropbox Sign
    const templateFields = {
      sellerSign: data.sellerSign,
      sellerName: data.sellerName,
      agreementDate: data.agreementDate,
      agreementAmount: data.agreementAmount,
      duration: data.duration,
      extensionPeriod: data.extensionPeriod,
      extensionAmount: data.extensionAmount,
      propertyLocation: data.propertyLocation,
      sellerEmail: data.sellerEmail,
    };

    // Call Dropbox Sign service to send the signature request
    const response =
      await this.dropboxSignService.createSignatureRequestWithTemplate(
        templateFields,
      );

    // Extract the necessary IDs from the response
    if (!response || !response.signatureRequest) {
      throw new Error(
        'Error: Dropbox Sign did not return a valid signature request ID.',
      );
    }

    // Save Dropbox Sign data to the database
    const documentData = {
      agreementId: newAgreement.id,
      signatureRequestId: response.signatureRequest.signatureRequestId,
      status: 'submitted',
    };
    await this.prisma.documentInstance.create({ data: documentData });

    return newAgreement;
  }

  async getAgreements() {
    return this.prisma.agreement.findMany();
  }

  async storeDocumentInstance(documentData: any) {
    return this.prisma.documentInstance.create({ data: documentData });
  }
}
