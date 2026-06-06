import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { EventsModule } from '../events/events.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
		EventsModule,
	],
	controllers: [BookingsController],
	providers: [BookingsService],
})
export class BookingsModule {}
