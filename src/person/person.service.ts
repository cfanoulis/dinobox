import { Injectable } from '@nestjs/common';
import type { CreatePersonData } from 'src/person/person.interface';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class PersonService {
	public constructor(public supabaseService: SupabaseService) {}

	public async getPersonById(id: string) {
		return this.supabaseService.useTable('people').select('id,slackid,full_name,email,phone,country').eq('id', id);
	}

	public async newPerson(createData: CreatePersonData) {
		return this.supabaseService.useTable('people').insert(createData).select('id,slackid,full_name,email,phone,country');
	}

	public async deletePerson(id: string) {
		return this.supabaseService.useTable('people').delete().eq('id', id);
	}

	public async editPerson(id: string, data: Partial<CreatePersonData>) {
		return this.supabaseService.useTable('people').update(data).eq('id', id);
	}
}
