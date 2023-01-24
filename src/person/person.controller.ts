import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Put, ValidationPipe } from '@nestjs/common';
import { CreatePersonDto, EditPersonDto } from 'src/person/person.interface';
import { PersonService } from 'src/person/person.service';
import { inspect } from 'util';

@Controller('person')
export class PersonController {
	public constructor(private personService: PersonService) {}

	@HttpCode(201)
	@Put('new')
	async newPerson(
		@Body(
			new ValidationPipe({
				whitelist: true
			})
		)
		createData: CreatePersonDto
	) {
		const { data, error } = await this.personService.newPerson(createData);

		if (error || data.length < 1)
			throw new HttpException(
				`User couldn't be created. Error: ${inspect(error, false, 2) ?? 'no user returned'}`,
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		return data[0];
	}

	@Get(':id')
	async getPersonById(@Param('id', ParseUUIDPipe) id: string) {
		const { error, data } = await this.personService.getPersonById(id);

		if (error || data.length < 1) throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
		return data[0];
	}

	@HttpCode(202)
	@Patch(':id')
	async editPerson(
		@Param('id', ParseUUIDPipe) id: string,
		@Body(
			new ValidationPipe({
				whitelist: true
			})
		)
		editData: Partial<EditPersonDto>
	) {
		const { data, error } = await this.personService.editPerson(id, editData);

		if (error || data.length < 1)
			throw new HttpException(`User couldn't be updated. Error: ${error ?? 'no user returned'}`, HttpStatus.INTERNAL_SERVER_ERROR);
		return data[0];
	}

	@Delete(':id')
	async deletePerson(@Param('id', ParseUUIDPipe) id: string) {
		const { error, data } = await this.personService.deletePerson(id);

		if (error || data.length < 1)
			throw new HttpException(`User couldn't be yeeted. Error: ${error ?? 'no user returned'}`, HttpStatus.INTERNAL_SERVER_ERROR);

		return data[0];
	}
}
