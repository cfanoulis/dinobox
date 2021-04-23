import { Body, Controller, Post } from '@nestjs/common';
import { IPersonLookupDto } from './people-dto';

@Controller('people')
export class PeopleController {
	@Post('/lookup')
	public lookupPerson(@Body() lookupDetails: IPersonLookupDto) {
		return {};
	}
}
