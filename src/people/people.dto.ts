import { IsEmail, IsOptional, IsString } from 'class-validator';

export class IPersonCreateDto {
	@IsEmail()
	public email: string;

	@IsString()
	public fullName: string;

	@IsOptional()
	public currentAddressId: string;

	@IsOptional()
	public slackId: string;

	@IsOptional()
	// @IsPhoneNumber() - enable only after forcing users to set phone number as intl version
	public phoneNumber: string;

	@IsString()
	@IsOptional()
	public mailSenderId: string;
}

export class IPersonLookupDto {
	@IsOptional()
	@IsString()
	public slackId?: string;

	@IsOptional()
	@IsEmail()
	public email?: string;
}
