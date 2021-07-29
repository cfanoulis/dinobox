import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { AirtablePlusPlus } from 'airtable-plusplus';
import { ErrorReplies } from 'src/lib/enum/ErrorReplies';
import type { IAirtablePerson } from './people';
import { IPersonCreateDto, IPersonLookupDto } from './people.dto';
import type { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
	private addressBase = new AirtablePlusPlus<IAirtablePerson>({
		apiKey: process.env.AIRTABLE_KEY,
		baseId: 'appWfavuh1ifoBxXI',
		tableName: 'Address'
	});

	public constructor(private peopleService: PeopleService) {}

	@Put('/create')
	public async createPerson(@Body(new ValidationPipe({ forbidUnknownValues: true, whitelist: true })) createDetails: IPersonCreateDto) {
		if (!createDetails) throw new HttpException(ErrorReplies.BAD_REQUEST, HttpStatus.BAD_REQUEST);

		const newPerson: IAirtablePerson = {
			'Full Name': createDetails.fullName,
			Email: createDetails.email
		};

		return this.peopleService.create(newPerson);
	}

	@Post('/lookup')
	public async lookupPerson(@Body(new ValidationPipe({ forbidUnknownValues: true, whitelist: true })) lookupDetails: IPersonLookupDto) {
		// we need either a slack id or an email here
		if (!lookupDetails || (!lookupDetails.email && !lookupDetails.slackId))
			throw new HttpException(ErrorReplies.NO_LOOKUP_DATA_PROVIDED, HttpStatus.BAD_REQUEST);

		const results = await this.peopleService.lookup(lookupDetails);
		if (!results) throw new HttpException(ErrorReplies.NOT_FOUND, HttpStatus.BAD_REQUEST);

		return results;
	}

	@Get('/:recid')
	public async getPerson(@Param('recid') recordId: string) {
		const person = await this.peopleService.get(recordId);
		if (!person) throw new HttpException(ErrorReplies.NOT_FOUND, HttpStatus.BAD_REQUEST);

		return person;
	}

	@Get('/:recid/address')
	public async getPersonAddress(@Param('recid') recordId: string) {
		const person = await this.peopleService.get(recordId);
		if (!person) throw new HttpException(ErrorReplies.NOT_FOUND, HttpStatus.BAD_REQUEST);

		const address = await this.addressBase.get(person.fields.Address[0]).catch((err) => {
			if (err.statusCode === 404) throw new HttpException(ErrorReplies.NOT_FOUND, HttpStatus.BAD_REQUEST);
			throw err;
		});

		return address;
	}

	@Get('/:recid/address/history')
	public async getPersonAddressHistory(@Param('recid') recordId: string) {
		const person = await this.peopleService.get(recordId);
		if (!person) throw new HttpException(ErrorReplies.NOT_FOUND, HttpStatus.BAD_REQUEST);

		const addressHistory = await this.addressBase.read({
			filterByFormula: this.peopleService.buildAddrHistoryFilter(person.fields['Address History'])
		});

		return addressHistory;
	}

	@Delete('/:recid')
	public async deletePerson(@Param('recid') recordId: string) {
		await this.peopleService.delete(recordId);
		return 'It hath been yeeted';
	}
}
