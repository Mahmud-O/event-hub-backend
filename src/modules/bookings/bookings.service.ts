import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { EventsService } from '../events/events.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
	constructor(
		@InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
		private readonly eventsService: EventsService,
	) {}

	async create(createBookingDto: CreateBookingDto, userId: string): Promise<BookingDocument> {
		const event = await this.eventsService.findById(createBookingDto.eventId);

		const activeBookings = await this.bookingModel
			.find({
				eventId: createBookingDto.eventId,
				status: { $in: ['Confirmed', 'Pending'] },
			})
			.exec();

		const bookedTickets = activeBookings.reduce((sum, b) => sum + b.ticketQuantity, 0);
		const availableTickets = event.capacity - bookedTickets;

		if (availableTickets < createBookingDto.ticketQuantity) {
			throw new BadRequestException(
				`Not enough tickets available. Only ${availableTickets} tickets remaining.`,
			);
		}

		const extrasPrice = (createBookingDto.selectedExtras ?? []).reduce(
			(sum, extra) => sum + extra.price,
			0,
		);
		const totalPrice = event.price * createBookingDto.ticketQuantity + extrasPrice;

		const newBooking = new this.bookingModel({
			...createBookingDto,
			userId,
			totalPrice,
			status: 'Pending',
		});

		return newBooking.save();
	}

	async findAllForUser(userId: string, user: any): Promise<BookingDocument[]> {
		if (user.role !== 'Admin' && user.userId !== userId) {
			throw new ForbiddenException('You are not authorized to view bookings of another user');
		}

		return this.bookingModel
			.find({ userId })
			.populate({
				path: 'eventId',
				populate: [{ path: 'categoryId' }, { path: 'organizerId', select: '-password' }],
			})
			.populate('userId', '-password')
			.exec();
	}

	async findById(id: string, user: any): Promise<BookingDocument> {
		const booking = await this.bookingModel
			.findById(id)
			.populate('userId', '-password')
			.exec();

		if (!booking) {
			throw new NotFoundException(`Booking with ID ${id} not found`);
		}

		const event = await this.eventsService.findById(booking.eventId.toString());

		const bookingUserIdStr = typeof booking.userId === 'object' && booking.userId ? (booking.userId as any)._id?.toString() : booking.userId?.toString();
		const organizerIdStr = typeof event.organizerId === 'object' && event.organizerId ? (event.organizerId as any)._id?.toString() : event.organizerId?.toString();
		const isOwner = bookingUserIdStr === user.userId;
		const isOrganizer = organizerIdStr === user.userId;
		const isAdmin = user.role === 'Admin';

		if (!isOwner && !isOrganizer && !isAdmin) {
			throw new ForbiddenException('You are not authorized to view this booking');
		}

		booking.eventId = event;

		return booking;
	}

	async updateStatus(
		id: string,
		updateBookingStatusDto: UpdateBookingStatusDto,
		user: any,
	): Promise<BookingDocument> {
		const booking = await this.bookingModel.findById(id).exec();
		if (!booking) {
			throw new NotFoundException(`Booking with ID ${id} not found`);
		}

		const event = await this.eventsService.findById(booking.eventId.toString());

		const organizerIdStr = typeof event.organizerId === 'object' && event.organizerId ? (event.organizerId as any)._id?.toString() : event.organizerId?.toString();
		const isOrganizer = organizerIdStr === user.userId;
		const isAdmin = user.role === 'Admin';

		if (!isOrganizer && !isAdmin) {
			throw new ForbiddenException('Only event organizers or admins can update booking status');
		}

		const newStatus = updateBookingStatusDto.status;

		if (booking.status === 'Cancelled' && (newStatus === 'Confirmed' || newStatus === 'Pending')) {
			const activeBookings = await this.bookingModel
				.find({
					eventId: booking.eventId,
					status: { $in: ['Confirmed', 'Pending'] },
					_id: { $ne: booking._id },
				})
				.exec();

			const bookedTickets = activeBookings.reduce((sum, b) => sum + b.ticketQuantity, 0);
			const availableTickets = event.capacity - bookedTickets;

			if (availableTickets < booking.ticketQuantity) {
				throw new BadRequestException(
					`Cannot re-activate booking. Not enough tickets available. Only ${availableTickets} remaining.`,
				);
			}
		}

		const updatedBooking = await this.bookingModel
			.findByIdAndUpdate(id, { $set: { status: newStatus } }, { new: true })
			.populate('userId', '-password')
			.exec();

		if (!updatedBooking) {
			throw new NotFoundException(`Booking with ID ${id} not found`);
		}

		updatedBooking.eventId = event;

		return updatedBooking;
	}
}
