import { Injectable, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WebhookService implements OnModuleInit {
  private DROPBOX_SIGN_SECRET: string;

  constructor(private readonly prisma: PrismaService) {}

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
    const {
      event: eventType,
      signatureRequest,
      status,
      event_id: eventId,
    } = event;

    try {
      if (eventType === 'signatureRequest') {
        await this.updateDocumentStatus(signatureRequest, status, eventId);
      } else {
        console.log(`Unhandled event type: ${eventType}`);
      }
    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  private async updateDocumentStatus(
    signatureRequestId: string,
    status: string,
    eventId: string,
  ) {
    try {
      return await this.prisma.documentInstance.updateMany({
        where: { signatureRequestId },
        data: { status, signatureRequestId: eventId },
      });
    } catch (error) {
      console.error(
        `Error updating document status for request ID ${signatureRequestId}:`,
        error,
      );
    }
  }
}
