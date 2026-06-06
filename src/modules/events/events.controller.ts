import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReqUser } from '../../common/decorators/user.decorator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { Event } from './schemas/event.schema';

@ApiTags('Events')
@Controller('events')
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get all events with filters',
		description: 'Retrieves a list of events from the database. Filtering can be done by search text (title/description), categoryId, organizerId, price range, and date range.',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved list of events.',
		type: [Event],
	})
	async findAll(@Query() query: QueryEventDto): Promise<Event[]> {
		return this.eventsService.findAll(query);
	}

	@Public()
	@Get(':id')
	@ApiOperation({
		summary: 'Get detailed event information',
		description: 'Retrieves complete details of a single event, including populated category and organizer profile information.',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved detailed event information.',
		type: Event,
	})
	@ApiResponse({
		status: 404,
		description: 'Event not found. The specified ID does not exist.',
	})
	async findById(@Param('id') id: string): Promise<Event> {
		return this.eventsService.findById(id);
	}

	@ApiBearerAuth()
	@Roles('Organizer', 'Admin')
	@Post()
	@ApiOperation({
		summary: 'Create a new event',
		description: 'Creates a new event listing. Restricted to organizers and administrators. The organizerId is automatically populated from the logged-in user context.',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 201,
		description: 'The event has been successfully created.',
		type: Event,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. Validations failed.',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. The logged-in user is not an Organizer or Admin.',
	})
	@ApiResponse({
		status: 404,
		description: 'Not Found. The specified categoryId does not exist.',
	})
	async create(@Body() createEventDto: CreateEventDto, @ReqUser() user: any): Promise<Event> {
		return this.eventsService.create(createEventDto, user.userId);
	}

	@ApiBearerAuth()
	@Roles('Organizer', 'Admin')
	@Put(':id')
	@ApiOperation({
		summary: 'Update event details',
		description: 'Updates details of an existing event. Restricted to the organizing user of the event or an Admin.',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 200,
		description: 'The event has been successfully updated.',
		type: Event,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. Validations failed.',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. You are not authorized to update this event.',
	})
	@ApiResponse({
		status: 404,
		description: 'Not Found. The event or specified categoryId was not found.',
	})
	async update(
		@Param('id') id: string,
		@Body() updateEventDto: UpdateEventDto,
		@ReqUser() user: any,
	): Promise<Event> {
		return this.eventsService.update(id, updateEventDto, user);
	}

	@ApiBearerAuth()
	@Roles('Organizer', 'Admin')
	@Delete(':id')
	@ApiOperation({
		summary: 'Cancel/Delete an event',
		description: 'Removes an event listing from the database. Restricted to the organizing user of the event or an Admin.',
	})
	@ApiResponse({
		status: 200,
		description: 'The event has been successfully deleted.',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. You are not authorized to delete this event.',
	})
	@ApiResponse({
		status: 404,
		description: 'Not Found. The event was not found.',
	})
	async delete(@Param('id') id: string, @ReqUser() user: any): Promise<{ message: string }> {
		await this.eventsService.delete(id, user);
		return { message: 'Event deleted successfully' };
	}
}
