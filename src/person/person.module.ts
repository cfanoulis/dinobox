import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
	imports: [SupabaseModule],
	providers: [PersonService],
	controllers: [PersonController]
})
export class PersonModule {}
