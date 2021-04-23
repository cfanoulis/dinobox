import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AirtablePlusPlus } from 'airtable-plusplus';
import { config } from 'dotenv';
import type { IPersonLookupDto } from './people-dto';
// TODO: Shouldn't be in here
config();
// todo: make configurable
const peopleBase = new AirtablePlusPlus({ apiKey: process.env.AIRTABLE_KEY, baseId: 'appWfavuh1ifoBxXI', tableName: 'People' });

@Controller('people')
export class PeopleController {
	@Post('/lookup')
	public async lookupPerson(@Body() lookupDetails: IPersonLookupDto) {
		const [person] = await peopleBase.read({ maxRecords: 1, filterByFormula: `{Slack ID} = "${lookupDetails.slackId!.toUpperCase()}"` });
		return person.id;
	}

	@Get('/:recid')
	public async getPerson(@Param('recid') recordId: string) {
		const person = await peopleBase.get(recordId);
		return person;
	}

	@Delete('/:recid')
	public async deletePerson(@Param('recid') recordId: string) {
		await peopleBase.delete(recordId);
		return 'It hath been yeeted';
	}
}
