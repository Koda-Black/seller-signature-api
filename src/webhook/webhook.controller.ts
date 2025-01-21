import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleWebhook(
    @Headers('x-dropbox-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!this.webhookService.verifySignature(payload, signature)) {
      console.warn('Invalid webhook signature received.');
      return res.status(403).json({ message: 'Forbidden: Invalid signature.' });
    }

    try {
      const event = req.body;
      console.log('Received Dropbox Sign webhook:', event);

      // Process the event
      await this.webhookService.processEvent(event);

      return res
        .status(200)
        .json({ message: 'Webhook processed successfully.' });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return res
        .status(500)
        .json({ message: 'Internal Server Error: Unable to process webhook.' });
    }
  }
}
