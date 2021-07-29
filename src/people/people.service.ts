import { Injectable } from '@nestjs/common';
import { AirtablePlusPlus, AirtablePlusPlusRecord } from 'airtable-plusplus';
import { IAirtablePerson } from './people';
import { IPersonLookupDto } from './people.dto';

const ALLOWED_FIELDS = ['ID', 'Email', 'Slack ID', 'Full Name', 'Address', 'Address History', 'Phone Number'];

@Injectable()
export class PeopleService {
	private peopleBase = new AirtablePlusPlus<IAirtablePerson>({
		apiKey: process.env.AIRTABLE_KEY,
		baseId: 'appWfavuh1ifoBxXI',
		tableName: 'People'
	});

	public lookup(data: IPersonLookupDto) {
		return this.peopleBase
			.read({
				filterByFormula: this.buildLookupFilter(data),
				fields: ALLOWED_FIELDS
			})
			.catch((err) => {
				if (err.statusCode === 404) return [];
				throw err;
			});
	}

	public async get(recordId: string) {
		const [result] = await this.peopleBase
			.read({
				maxRecords: 1,
				filterByFormula: `RECORD_ID() = "${recordId}"`,
				fields: ALLOWED_FIELDS
			})
			.catch((err) => {
				if (err.statusCode === 404) return [undefined];
				throw err;
			});

		return result as AirtablePlusPlusRecord<IAirtablePerson> | undefined;
	}

	public create(data: IAirtablePerson) {
		return this.peopleBase.create(data);
	}

	public delete(recordId: string) {
		return this.peopleBase.delete(recordId).catch((err) => {
			if (err.statusCode !== 404) throw err;
		});
	}

	public buildLookupFilter(lookup: IPersonLookupDto) {
		const filter = [];
		if (lookup.slackId) filter.push(`{Slack ID} = "${lookup.slackId.toUpperCase()}"`);
		if (lookup.email) filter.push(`LOWER(Email) = "${lookup.email.toLowerCase()}"`);
		return `OR(${filter.join(',')})`;
	}

	public buildAddrHistoryFilter(historyIds: string[]) {
		return `OR(${historyIds.map((e) => `RECORD_ID() = "${e}"`).join(',')})`;
	}
}
