// src/dropbox-sign/dropbox-sign.service.ts
import { Injectable } from '@nestjs/common';
import * as DropboxSign from '@dropbox/sign';

// import { HelloSignEmbedded } from '@hellosign-skd/embedded';
@Injectable()
export class DropboxSignService {
  private dropboxSign: DropboxSign.SignatureRequestApi;

  constructor() {
    this.dropboxSign = new DropboxSign.SignatureRequestApi();
    this.dropboxSign.setApiKey(process.env.DROPBOX_SIGN_API_KEY);
  }

  async createEmbeddedSignatureRequest(templateFields: any) {
    const response = await this.dropboxSign.signatureRequestGet.createEmbedded({
      clientId: process.env.DROPBOX_SIGN_CLIENT_ID,
      title: 'Test Agreement',
      subject: 'Please sign this document',
      message: 'Let us know if you have questions.',
      signers: [
        {
          email_address: templateFields.sellerSign,
          name: templateFields.sellerName,
        },
      ],
      files: process.env.DROPBOX_TEMPLATE_ID,
      custom_fields: templateFields,
    });
    return response;
  }

  async getEmbeddedSigningUrl(signatureId: string) {
    const response = await this.dropboxSign.embedded.getSignUrl(signatureId);
    return response.embedded.sign_url;
  }

  async verifyWebhook(request: any, signature: string) {
    const isValid = await this.dropboxSign.webhook.verify(
      request.body,
      signature,
    );
    return isValid;
  }
}
