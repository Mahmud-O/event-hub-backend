import { Controller, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
	constructor(private readonly bookingsService: BookingsService) {}

	@Get()
	findAll(): Array<{ message: string }> {
		return this.bookingsService.findAll();
	}
}
