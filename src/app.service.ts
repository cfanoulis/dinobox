import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return "In an alternate reality, I'm a corgi";
	}
}
