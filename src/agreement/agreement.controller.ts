import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { DropboxSignService } from '../dropbox/dropbox.service';
import { AgreementDto } from './dto/agreement.dto';

@Controller('agreement')
export class AgreementsController {
  constructor(
    private readonly agreementsService: AgreementsService,
    private readonly dropboxSignService: DropboxSignService,
  ) {}

  @Post()
  async createAgreement(@Body() agreementDto: AgreementDto) {
    try {
      // Step 1: Create agreement record in the database
      const agreement =
        await this.agreementsService.createAgreement(agreementDto);

      if (!agreement) {
        throw new HttpException(
          'Failed to create agreement',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Step 2: Store document instance
      const documentInstance =
        await this.agreementsService.storeDocumentInstance({
          agreementId: agreement.id,
          status: 'created',
        });

      // Step 3: Trigger Dropbox Sign signature request
      const signatureRequest =
        await this.dropboxSignService.createSignatureRequestWithTemplate({
          ...agreementDto,
          agreementId: agreement.id,
        });

      return {
        agreement,
        documentInstance,
        signatureRequest,
      };
    } catch (error) {
      console.error('Error creating agreement:', error);
      throw new HttpException(
        'Error creating agreement',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAgreements() {
    return this.agreementsService.getAgreements();
  }
}
