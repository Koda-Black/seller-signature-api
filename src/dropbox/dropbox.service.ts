import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as DropboxSign from '@dropbox/sign';

@Injectable()
export class DropboxSignService {
  private signatureRequestApi: DropboxSign.SignatureRequestApi;

  constructor(private readonly configService: ConfigService) {
    // Initialize the SignatureRequestApi with the API key
    this.signatureRequestApi = new DropboxSign.SignatureRequestApi();
    this.signatureRequestApi.username = this.configService.get<string>(
      'DROPBOX_SIGN_API_KEY',
    );
  }

  async createSignatureRequestWithTemplate(data: any) {
    const templateId = this.configService.get<string>('DROPBOX_TEMPLATE_ID');
    if (!templateId) {
      throw new Error('Template ID is missing in the configuration.');
    }

    // Define custom fields
    const customFields: DropboxSign.SubCustomField[] = [
      { name: 'sellerSign', value: data.sellerSign || 'Signed' },
      { name: 'sellerName', value: data.sellerName || 'Default Seller' },
      {
        name: 'agreementDate',
        value: data.agreementDate || new Date().toISOString(),
      },
      {
        name: 'agreementAmount',
        value: data.agreementAmount?.toString() || '0',
      },
      { name: 'duration', value: data.duration || 'N/A' },
      { name: 'extensionPeriod', value: data.extensionPeriod || 'N/A' },
      {
        name: 'agreementDate',
        value: data.agreementDate || new Date().toISOString().split('T')[0],
      },
      { name: 'propertyLocation', value: data.propertyLocation || 'N/A' },
    ];

    // Define signers
    const buyerRole: DropboxSign.SubSignatureRequestTemplateSigner = {
      role: 'Buyer',
      emailAddress: data.buyerEmail || 'onuorah2kingsley@gmail.com',
      name: data.buyerName || 'Buyer',
    };

    const sellerRole: DropboxSign.SubSignatureRequestTemplateSigner = {
      role: 'Seller',
      emailAddress: data.sellerEmail || 'kodablack.me@gmail.com',
      name: data.sellerName || 'Seller',
    };

    const signers = [buyerRole, sellerRole];
    console.log('Signers:', signers);

    // Prepare the request data
    const requestData: DropboxSign.SignatureRequestSendWithTemplateRequest = {
      templateIds: [templateId],
      subject: 'Purchase Order',
      message: 'Glad we could come to an agreement.',
      signers: [buyerRole, sellerRole],
      customFields,
      signingOptions: {
        draw: true, // Allow drawing a signature
        type: true, // Allow typing a signature
        upload: true, // Allow uploading an image
        defaultType: DropboxSign.SubSigningOptions.DefaultTypeEnum.Draw, // Default to drawing a signature
      },
      testMode: true,
    };

    console.log('Request Data:', JSON.stringify(requestData, null, 2));

    try {
      // Send the signature request
      const response =
        await this.signatureRequestApi.signatureRequestSendWithTemplate(
          requestData,
        );
      return response.body;
    } catch (error) {
      console.error('Error creating signature request:', {
        message: error.message,
        details: error.response?.body?.error || error.body?.error,
        requestData,
      });
      throw new Error(
        'Failed to create signature request. Please check the logs for details.',
      );
    }
  }

  async getDownloadUrl(signatureRequestId: string) {
    try {
      // Use signatureRequestGet to get metadata about the signature request
      const response =
        await this.signatureRequestApi.signatureRequestGet(signatureRequestId);

      console.log('Download URL response:', response.body);

      // The download URL is available in the response
      return response.body.signatureRequest.filesUrl;
    } catch (error) {
      console.error('Error fetching download URL:', error);
      throw error;
    }
  }
}
