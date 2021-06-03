import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Res, ValidationPipe } from '@nestjs/common';
import { AirtablePlusPlus } from 'airtable-plusplus';
import type { FastifyReply } from 'fastify';
import { ErrorReplies } from 'src/lib/enum/ErrorReplies';
import type { IAirtablePerson } from './people';
import { IPersonCreateDto, IPersonLookupDto } from './people.dto';
import type { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
	private peopleBase = new AirtablePlusPlus<IAirtablePerson>({
		apiKey: process.env.AIRTABLE_KEY,
		baseId: 'appWfavuh1ifoBxXI',
		tableName: 'People'
	});

	private addressBase = new AirtablePlusPlus<IAirtablePerson>({
		apiKey: process.env.AIRTABLE_KEY,
		baseId: 'appWfavuh1ifoBxXI',
		tableName: 'People'
	});

	public constructor(@Inject('PeopleService') private peopleService: PeopleService) {}

	@Put('/create')
	public async createPerson(
		@Res() res: FastifyReply,
		@Body(new ValidationPipe({ expectedType: IPersonCreateDto })) createDetails: IPersonCreateDto
	) {
		if (!createDetails) return res.status(400).send({ error: ErrorReplies.BadRequest, message: ['you must provide data'] });

		const newPerson: IAirtablePerson = {
			'Full Name': createDetails.fullName,
			Email: createDetails.email
		};
		const result = await this.peopleBase.create(newPerson);

		return res.status(200).send(result);
	}

	@Post('/lookup')
	public async lookupPerson(
		@Res() res: FastifyReply,
		@Body(new ValidationPipe({ expectedType: IPersonLookupDto })) lookupDetails: IPersonLookupDto
	) {
		if (!lookupDetails || (!lookupDetails.email && !lookupDetails.slackId))
			return res.status(400).send({ error: ErrorReplies.BadRequest, message: ['you must provide either a slackId or an email to lookup'] });

		const [person] = await this.peopleBase.read({
			maxRecords: 1,
			filterByFormula: this.peopleService.buildLookupFilter(lookupDetails),
			fields: ['ID', 'Email', 'Slack ID', 'Full Name', 'Address', 'Address History', 'Phone number']
		});

		if (!person) return res.status(404).send({ message: ErrorReplies.NotFound });
		return res.status(200).send(person);
	}

	@Get('/:recid')
	public async getPerson(@Res() res: FastifyReply, @Param('recid') recordId: string) {
		const [person] = await this.peopleBase.read({
			maxRecords: 1,
			filterByFormula: `RECORD_ID() = "${recordId}"`,
			fields: ['ID', 'Email', 'Slack ID', 'Full Name', 'Address', 'Address History', 'Phone number']
		});

		if (!person) return res.status(404).send({ error: ErrorReplies.NotFound });
		return res.status(200).send(person);
	}

	@Get('/:recid/address')
	public async getPersonAddress(@Res() res: FastifyReply, @Param('recid') recordId: string) {
		const [person] = await this.peopleBase.read({
			maxRecords: 1,
			filterByFormula: `RECORD_ID() = "${recordId}"`,
			fields: ['Address']
		});
		if (!person) return res.status(404).send({ error: ErrorReplies.NotFound });

		const address = await this.addressBase.get(person.fields.Address[0]).catch((err) => {
			if (err.statusCode === 404) return res.status(404).send({ error: ErrorReplies.NotFound });
			throw err;
		});

		return res.status(200).send(address);
	}

	@Get('/:recid/address/history')
	public async getPersonAddressHistory(@Res() res: FastifyReply, @Param('recid') recordId: string) {
		const [person] = await this.peopleBase.read({
			maxRecords: 1,
			filterByFormula: `RECORD_ID() = "${recordId}"`,
			fields: ['Address']
		});
		if (!person) return res.status(404).send({ error: ErrorReplies.NotFound });

		const addressHistory = await this.addressBase.read({
			filterByFormula: this.peopleService.buildAddrHistoryFilter(person.fields['Address History'])
		});

		return res.status(200).send(addressHistory);
	}

	@Delete('/:recid')
	public async deletePerson(@Param('recid') recordId: string) {
		await this.peopleBase.delete(recordId).catch((err) => {
			if (err.statusCode !== 404) throw err;
		});
		return 'It hath been yeeted';
	}
}
