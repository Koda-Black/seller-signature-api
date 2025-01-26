import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AgreementsService } from './agreement.service';
import { AgreementDto } from './dto/agreement.dto';

@Controller('agreement')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Post()
  async createAgreement(@Body() agreementDto: AgreementDto) {
    try {
      // Step 1: Create the agreement and send the signature request
      const { agreement, signatureRequest } =
        await this.agreementsService.createAgreement(agreementDto);

      return {
        agreement,
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
