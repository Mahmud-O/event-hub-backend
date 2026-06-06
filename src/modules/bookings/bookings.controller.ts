import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReqUser } from '../../common/decorators/user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Booking } from './schemas/booking.schema';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
	constructor(private readonly bookingsService: BookingsService) {}

	@Post()
	@ApiOperation({
		summary: 'Create a new ticket booking',
		description: 'Places a booking for tickets on a specific event. The pricing is automatically computed based on the ticket quantity and selected extras. Available capacity is verified before confirming the booking.',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 201,
		description: 'The booking was successfully created in Pending status.',
		type: Booking,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. Validations failed or not enough ticket capacity is available.',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid Bearer token.',
	})
	@ApiResponse({
		status: 404,
		description: 'Not Found. The specified eventId does not exist.',
	})
	async create(@Body() createBookingDto: CreateBookingDto, @ReqUser() user: any): Promise<Booking> {
		return this.bookingsService.create(createBookingDto, user.userId);
	}

	@Get('user/:userId')
	@ApiOperation({
		summary: 'Get all bookings for a specific user',
		description: 'Retrieves all bookings made by a user. Users can only view their own bookings, while Administrators can retrieve bookings for any user.',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved bookings list.',
		type: [Booking],
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. Attempted to read bookings of another user without Admin rights.',
	})
	async findAllForUser(@Param('userId') userId: string, @ReqUser() user: any): Promise<Booking[]> {
		return this.bookingsService.findAllForUser(userId, user);
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Get specific booking details',
		description: 'Retrieves details of a single booking. Access is authorized for the booking owner, the organizing user of the event, or an Admin.',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved detailed booking information.',
		type: Booking,
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. You are not authorized to view this booking.',
	})
	@ApiResponse({
		status: 404,
		description: 'Not Found. The booking does not exist.',
	})
	async findById(@Param('id') id: string, @ReqUser() user: any): Promise<Booking> {
		return this.bookingsService.findById(id, user);
	}

	@Roles('Organizer', 'Admin')
	@Patch(':id/status')
	@ApiOperation({
		summary: 'Update booking status',
		description: 'Updates the status of an existing booking (e.g. Confirmed, Cancelled). Restricted to the organizer of the booked event, or an Admin.',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 200,
		description: 'Booking status successfully updated.',
		type: Booking,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. Failed validations or re-confirming a cancelled booking failed capacity checks.',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. The logged-in user is not authorized (not organizer/admin).',
	})
	@ApiResponse({
		status: 404,
		description: 'Not Found. The booking does not exist.',
	})
	async updateStatus(
		@Param('id') id: string,
		@Body() updateBookingStatusDto: UpdateBookingStatusDto,
		@ReqUser() user: any,
	): Promise<Booking> {
		return this.bookingsService.updateStatus(id, updateBookingStatusDto, user);
	}
}
