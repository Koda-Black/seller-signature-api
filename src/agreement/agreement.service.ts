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
      // buyerEmail: data.buyerEmail,
      // buyerName: data.buyerName,
    };

    // Call Dropbox Sign service to send the signature request
    let signatureRequestResponse;
    try {
      signatureRequestResponse =
        await this.dropboxSignService.createSignatureRequestWithTemplate(
          templateFields,
        );
    } catch (error) {
      console.error('Error sending signature request:', error);
      throw new Error('Failed to send signature request. No data was saved.');
    }

    // Verify the response contains a valid signature request ID
    if (
      !signatureRequestResponse ||
      !signatureRequestResponse.signatureRequest ||
      !signatureRequestResponse.signatureRequest.signatureRequestId
    ) {
      throw new Error(
        'Error: Dropbox Sign did not return a valid signature request ID.',
      );
    }

    // Extract the signature request ID
    const signatureRequestId =
      signatureRequestResponse.signatureRequest.signatureRequestId;

    // Save the agreement and document instance to the database
    let newAgreement;
    try {
      // Create the agreement in the database
      newAgreement = await this.prisma.agreement.create({ data });

      // Save the document instance with the signature request ID and initial status
      await this.storeDocumentInstance({
        agreementId: newAgreement.id,
        signatureRequestId: signatureRequestId,
        downloadUrl: '',
        status: 'sent', // Initial status from the first event
      });
    } catch (error) {
      console.error('Error saving agreement to the database:', error);
      throw new Error(
        'Failed to save agreement to the database. No data was saved.',
      );
    }

    return {
      agreement: newAgreement,
      signatureRequest: signatureRequestResponse,
    };
  }

  async getAgreements() {
    return this.prisma.agreement.findMany();
  }

  async storeDocumentInstance(documentData: any) {
    return this.prisma.documentInstance.create({
      data: {
        agreementId: documentData.agreementId,
        signatureRequestId: documentData.signatureRequestId,
        status: documentData.status || 'sent',
        downloadUrl: documentData.downloadUrl || '',
      },
    });
  }
}
