import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
	findAll(): Array<{ message: string }> {
		return [{ message: 'bookings-ready' }];
	}
}
