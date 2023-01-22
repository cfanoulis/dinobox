import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import type { Database } from 'src/supabase/supabase';
@Injectable()
export class SupabaseService {
	#supabaseClient = createClient<Database>(`https://${process.env.SUPA_PROJECT_REF!}.supabase.co`, process.env.SUPA_SERVICE_KEY!);

	public useTable(table: string) {
		return this.#supabaseClient.from(table);
	}
}
