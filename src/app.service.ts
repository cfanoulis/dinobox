import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	public getHello(): string {
		return 'Who-whoops! I dropped my monster stamp, to use for my  M A G N U M  envelope';
	}
}
