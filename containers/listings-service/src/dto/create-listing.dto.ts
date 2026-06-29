import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min, Max } from 'class-validator';

export class CreateListingDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @IsNumber()
  @Min(0)
  @Max(999999999)
  price: number;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;
}
