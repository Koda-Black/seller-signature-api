// src/dropbox-sign/dropbox-sign.controller.ts
import { Controller, Get, Post, Query } from '@nestjs/common';
import { DropboxSignService } from './dropbox.service';

@Controller('dropbox-sign')
export class DropboxSignController {
  constructor(private readonly dropboxSignService: DropboxSignService) {}

  @Post('create-signature-request')
  async createSignatureRequest(@Query() templateFields: any) {
    const response =
      await this.dropboxSignService.createEmbeddedSignatureRequest(
        templateFields,
      );
    return response;
  }

  @Get('get-signing-url')
  async getSigningUrl(@Query('signatureId') signatureId: string) {
    const url =
      await this.dropboxSignService.getEmbeddedSigningUrl(signatureId);
    return { signUrl: url };
  }

  @Post('webhook')
  async handleWebhook(@Query() body: any) {
    console.log('Webhook received:', body);
  }
}
