import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min, Max, IsIn } from 'class-validator';

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(999999999)
  price?: number;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  category?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(['ACTIVE', 'RESERVED', 'SOLD', 'CANCELLED'])
  status?: string;
}
