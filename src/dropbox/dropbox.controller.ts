import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DropboxSignService } from './dropbox.service';

@Controller('dropbox-sign')
export class DropboxSignController {
  constructor(private readonly dropboxSignService: DropboxSignService) {}

  @Post('create-signature-request')
  async createSignatureRequest(@Body() data: any) {
    return this.dropboxSignService.createSignatureRequestWithTemplate(data);
  }

  // @Get('get-signing-url')
  // async getSigningUrl(@Query('signatureId') signatureId: string) {
  //   const url =
  //     await this.dropboxSignService.EmbeddedSignUrlResponse(signatureId);
  //   return { signUrl: url };
  // }

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    console.log('Webhook received:', body);
  }
}
