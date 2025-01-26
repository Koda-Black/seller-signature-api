import { Injectable, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { DropboxSignService } from '../dropbox/dropbox.service';
import { MailService } from '../mail/mail.service'; // Import MailService

@Injectable()
export class WebhookService implements OnModuleInit {
  private DROPBOX_SIGN_SECRET: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly dropboxSignService: DropboxSignService,
    private readonly mailService: MailService, // Inject MailService
  ) {}

  onModuleInit() {
    this.DROPBOX_SIGN_SECRET = process.env.DROPBOX_SIGN_SECRET;
    if (!this.DROPBOX_SIGN_SECRET) {
      throw new Error('Environment variable DROPBOX_SIGN_SECRET is not set.');
    }
  }

  verifySignature(payload: string, signature: string): boolean {
    try {
      const computedSignature = crypto
        .createHmac('sha256', this.DROPBOX_SIGN_SECRET)
        .update(payload)
        .digest('hex');
      return computedSignature === signature;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  async processEvent(event: any) {
    const { event_type, signature_request } = event;

    try {
      if (event_type && signature_request) {
        const signatureRequestId = signature_request.signature_request_id;
        const status = this.mapEventTypeToStatus(event_type);

        console.log('Processing event:', {
          event_type,
          signatureRequestId,
          status,
        });

        if (status) {
          // Update the document status in the database
          await this.updateDocumentStatus(signatureRequestId, status);

          // Handle the "all signed" event
          if (event_type === 'signature_request_all_signed') {
            // Fetch the download URL for the signed document
            const downloadUrl =
              await this.dropboxSignService.getDownloadUrl(signatureRequestId);

            console.log('Download URL:', downloadUrl);

            // Save the download URL to the database
            await this.prisma.documentInstance.updateMany({
              where: { signatureRequestId },
              data: { downloadUrl },
            });

            // Send the download URL to the signers' emails
            const signers = signature_request.signers;
            for (const signer of signers) {
              await this.mailService.sendEmail({
                to: signer.email_address,
                subject: 'Your Signed Document is Ready',
                text: `Download your signed document here: ${downloadUrl}`,
              });
            }
          }
        } else {
          console.log(`Unhandled event type: ${event_type}`);
        }
      } else {
        console.log('Invalid event payload:', event);
      }
    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  private mapEventTypeToStatus(eventType: string): string | null {
    switch (eventType) {
      case 'signature_request_sent':
        return 'sent';
      case 'signature_request_viewed':
        return 'viewed';
      case 'signature_request_signed':
        return 'signed';
      case 'signature_request_all_signed':
        return 'completed';
      case 'signature_request_declined':
        return 'declined';
      case 'signature_request_remind':
        return 'reminded';
      default:
        return null;
    }
  }

  private async updateDocumentStatus(
    signatureRequestId: string,
    status: string,
  ) {
    try {
      // Check if the document instance exists
      const documentInstance = await this.prisma.documentInstance.findFirst({
        where: { signatureRequestId },
      });

      if (!documentInstance) {
        console.warn(
          `No document found with signatureRequestId: ${signatureRequestId}`,
        );
        return;
      }

      // Update the document status
      const result = await this.prisma.documentInstance.updateMany({
        where: { signatureRequestId },
        data: { status },
      });

      console.log('Update result:', result);

      if (result.count === 0) {
        console.warn(
          `No documents updated for signatureRequestId: ${signatureRequestId}`,
        );
      } else {
        console.log(
          `Updated document status for request ID ${signatureRequestId} to ${status}.`,
        );
      }
    } catch (error) {
      console.error(
        `Error updating document status for request ID ${signatureRequestId}:`,
        error,
      );
    }
  }
}
