import { Injectable } from '@nestjs/common';
import type { CreatePersonDto, EditPersonDto } from 'src/person/person.interface';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class PersonService {
	private db;
	public constructor(supabaseService: SupabaseService) {
		this.db = supabaseService.useTable('people');
	}

	public async getPersonById(id: string) {
		return this.db.select('id,slack_id,full_name,email,country').eq('id', id);
	}

	public async getPersonBySlack(id: string) {
		return this.db.select('id,slack_id,full_name,email,country').eq('slack_id', id.toUpperCase()); //we always should store this in uppercase?
	}

	public async getPersonByEmail(email: string) {
		return this.db.select('id,slack_id,full_name,email,country').eq('email', email);
	}

	public async getPersonMailData(id: string) {
		return this.db.select('id,full_name,email,phone,addr_line_1,addr_line_2,city,postcode,state,country').eq('id', id);
	}

	public async newPerson(createData: CreatePersonDto) {
		return this.db
			.insert({
				email: createData.email,
				full_name: createData.full_name,
				slack_id: (createData.slack_id ?? 'U00001').toUpperCase()
			})
			.select('id,slack_id,full_name,email,phone,country');
	}

	public async deletePerson(id: string) {
		return this.db.delete().eq('id', id);
	}

	public async editPerson(id: string, data: Partial<EditPersonDto>) {
		return this.db.update(data).eq('id', id);
	}
}
