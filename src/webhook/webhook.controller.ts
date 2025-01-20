import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';

@Controller('webhooks')
export class WebhooksController {
  private readonly DROPBOX_SIGN_SECRET = process.env.DROPBOX_SIGN_SECRET;

  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handleWebhook(
    @Headers('x-dropbox-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const payload = JSON.stringify(req.body);

    // Verify the webhook signature
    if (!this.verifySignature(payload, signature)) {
      return res.status(403).send('Forbidden');
    }

    const event = req.body;
    console.log('Received Dropbox Sign webhook:', event);

    // Process the event, e.g., if the document is signed
    if (event.event === 'signature_request_signed') {
      const signatureRequestId = event.signature_request_id;
      const status = event.status; // Status like "signed", "declined", etc.

      // Update the document status in the database
      const updatedDocument = await this.updateDocumentStatus(
        signatureRequestId,
        status,
      );
      if (updatedDocument) {
        console.log(
          `Document with ID ${signatureRequestId} has been updated to status: ${status}`,
        );
      } else {
        console.error('Document not found or status update failed');
      }
    }

    // Respond with a success message
    res.status(200).send('Webhook received');
  }

  private verifySignature(payload: string, signature: string): boolean {
    const computedSignature = crypto
      .createHmac('sha256', this.DROPBOX_SIGN_SECRET)
      .update(payload)
      .digest('hex');
    return computedSignature === signature;
  }

  // Function to update document status based on the signature request ID
  private async updateDocumentStatus(
    signatureRequestId: string,
    status: string,
  ) {
    try {
      // Update the status of the document instance
      return await this.prisma.documentInstance.updateMany({
        where: { signatureRequestId },
        data: { status },
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      return null;
    }
  }
}
