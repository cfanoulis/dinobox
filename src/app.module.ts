import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PeopleController } from './people/people.controller';
import { PeopleService } from './people/people.service';
import { PeopleModule } from './people/people.module';

@Module({
	imports: [PeopleModule],
	controllers: [AppController, PeopleController],
	providers: [AppService, PeopleService]
})
export class AppModule {}
