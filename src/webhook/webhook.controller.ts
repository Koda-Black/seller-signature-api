import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller('webhooks')
export class WebhooksController {
  private readonly DROPBOX_SIGN_SECRET = process.env.DROPBOX_SIGN_SECRET;

  @Post()
  async handleWebhook(
    @Headers('x-dropbox-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const payload = JSON.stringify(req.body);

    if (!this.verifySignature(payload, signature)) {
      return res.status(403).send('Forbidden');
    }

    const event = req.body;
    console.log('Received Dropbox Sign webhook:', event);
    res.status(200).send('Webhook received');
  }

  private verifySignature(payload: string, signature: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', this.DROPBOX_SIGN_SECRET)
      .update(payload)
      .digest('hex');
    return computedSignature === signature;
  }
}
