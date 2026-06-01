import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  user_token: string;

  @IsString()
  @IsNotEmpty()
  session_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: 'User request must not exceed 1000 characters.',
  })
  message: string;
}
