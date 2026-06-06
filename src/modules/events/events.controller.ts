import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Get()
	findAll(): Array<{ message: string }> {
		return this.eventsService.findAll();
	}
}
