import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class MessageContent {
  @IsNotEmpty()
  @IsIn(['OTP', 'PASSWORD', 'MESSAGE', 'CONFIRMATION'])
  contentType: 'OTP' | 'PASSWORD' | 'MESSAGE' | 'CONFIRMATION';

  @IsNotEmpty()
  @IsString()
  content: string;
}
