import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
		CategoriesModule,
	],
	controllers: [EventsController],
	providers: [EventsService],
	exports: [EventsService],
})
export class EventsModule {}
