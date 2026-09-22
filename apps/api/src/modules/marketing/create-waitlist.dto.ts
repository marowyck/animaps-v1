import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

const PROFILE_TYPES = [
  "person",
  "ong",
  "veterinary_clinic",
  "other",
] as const;

export class CreateWaitlistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(PROFILE_TYPES)
  profileType!: (typeof PROFILE_TYPES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  state?: string | null;

  @IsBoolean()
  lgpdConsent!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  privacyPolicyVersion?: string | null;
}
