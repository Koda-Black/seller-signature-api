import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as DropboxSign from '@dropbox/sign';

@Injectable()
export class DropboxSignService {
  private signatureRequestApi: DropboxSign.SignatureRequestApi;

  constructor(private readonly configService: ConfigService) {
    this.signatureRequestApi = new DropboxSign.SignatureRequestApi();
    this.signatureRequestApi.username = this.configService.get<string>(
      'DROPBOX_SIGN_API_KEY',
    );
  }

  async createSignatureRequestWithTemplate(data: any) {
    const templateId = this.configService.get<string>('DROPBOX_TEMPLATE_ID');
    const customFields: DropboxSign.SubCustomField[] = [
      { name: 'sellerSign', value: data.sellerSign },
      { name: 'sellerName', value: data.sellerName },
      { name: 'agreementDate', value: data.agreementDate },
      { name: 'agreementAmount', value: data.agreementAmount },
      { name: 'duration', value: data.duration },
      { name: 'extensionPeriod', value: data.extensionPeriod },
      { name: 'extensionAmount', value: data.extensionAmount },
      { name: 'propertyLocation', value: data.propertyLocation },
    ];

    const ccs: DropboxSign.SubCC[] = [
      { role: 'Sender', emailAddress: 'onuorah2kingsley@gmail.com' },
    ];

    const requestData: DropboxSign.SignatureRequestSendWithTemplateRequest = {
      templateIds: [templateId],
      subject: 'Purchase Order',
      message: 'Glad we could come to an agreement.',
      signers: [
        {
          role: 'Client',
          // emailAddress: data.clientEmail,
          // name: data.clientName,
          emailAddress: 'kodablack.me@gmail.com',
          name: 'Kelechi NAN',
        },
      ],
      ccs,
      customFields,
      testMode: true,
    };

    try {
      const response =
        await this.signatureRequestApi.signatureRequestSendWithTemplate(
          requestData,
        );
      return response.body;
    } catch (error) {
      console.error('Error creating signature request:', error.body);
      throw error;
    }
  }
}
