import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePersonDto {
	@IsString()
	@IsOptional()
	slack_id?: string;

	@IsString()
	@IsNotEmpty()
	full_name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsOptional()
	phone?: string;
}

export class EditPersonDto {
	@IsString()
	@IsOptional()
	full_name?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	phone?: string;

	@IsString()
	@IsOptional()
	addr_line_1?: string;

	@IsString()
	@IsOptional()
	addr_line_2?: string;

	@IsString()
	@IsOptional()
	city?: string;

	@IsString()
	@IsOptional()
	state?: string;

	@IsString()
	@IsOptional()
	postcode: string;

	@IsString()
	@IsOptional()
	country: string;
}
