import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class AgreementDto {
  @IsString()
  sellerName: string;

  @IsString()
  propertyLocation: string;

  @IsString()
  agreementDate: string;

  @IsNumber()
  agreementAmount: number;

  @IsString()
  duration: string;

  @IsOptional()
  @IsString()
  extensionPeriod?: string;

  @IsOptional()
  @IsNumber()
  extensionAmount?: number;

  @IsString()
  sellerSign: string;

  @IsString()
  signedBy: string;
}
