import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
	findAll(): Array<{ message: string }> {
		return [{ message: 'events-ready' }];
	}
}
