import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { AgreementDto } from './dto/agreement.dto'; // Import your DTO
// import * as DropboxSign from '@dropbox/sign';

@Controller('agreements')
export class AgreementsController {
  constructor(private agreementsService: AgreementsService) {}

  @Post()
  async create(@Body() agreementDto: AgreementDto) {
    try {
      const agreement =
        await this.agreementsService.createAgreement(agreementDto);

      if (!agreement) {
        console.error('Error creating agreement:');

        // throw new HttpException(
        //   'Failed to create agreement',
        //   HttpStatus.INTERNAL_SERVER_ERROR,
        // );
      }

      // Store document instance only after successful agreement creation
      await this.agreementsService.storeDocumentInstance({
        agreementId: agreement.id,
        status: 'created',
      });

      return agreement;
    } catch (error) {
      // Handle errors during agreement creation or document instance storage
      console.error('Error creating agreement:', error);
      // throw new HttpException(
      //   'Error creating agreement',
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
    }
  }

  @Get()
  async findAll() {
    return this.agreementsService.getAgreements();
  }
}
