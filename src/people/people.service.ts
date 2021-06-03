import { Injectable } from '@nestjs/common';
// @ts-expect-error we need this to not be stripped
import { IPersonLookupDto } from './people.dto';

@Injectable()
export class PeopleService {
	public buildLookupFilter(lookup: IPersonLookupDto) {
		const filter = [];
		if (lookup.slackId) filter.push(`{Slack ID} = "${lookup.slackId.toUpperCase()}"`);
		if (lookup.email) filter.push(`LOWER(Email) = "${lookup.email.toLowerCase()}"`);
		return `OR(${filter.join(',')})`;
	}

	public buildAddrHistoryFilter(historyIds: string[]) {
		return `OR(${historyIds.map((e) => `RECORD_ID() = "${e}"`).join(',')})`;
	}

	public static AllowedFields: ['ID', 'Email', 'Slack ID', 'Full Name', 'Address', 'Address History', 'Phone Number'];
}
