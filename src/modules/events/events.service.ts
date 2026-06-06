import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CategoriesService } from '../categories/categories.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventDto } from './dto/query-event.dto';

@Injectable()
export class EventsService {
	constructor(
		@InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
		private readonly categoriesService: CategoriesService,
	) {}

	async create(createEventDto: CreateEventDto, organizerId: string): Promise<EventDocument> {
		const categoryExists = await this.categoriesService.findById(createEventDto.categoryId);
		if (!categoryExists) {
			throw new NotFoundException(`Category with ID ${createEventDto.categoryId} not found`);
		}

		const newEvent = new this.eventModel({
			...createEventDto,
			organizerId,
		});

		return newEvent.save();
	}

	async findAll(query: QueryEventDto): Promise<EventDocument[]> {
		const filter: any = {};

		if (query.search) {
			filter.$or = [
				{ title: { $regex: query.search, $options: 'i' } },
				{ description: { $regex: query.search, $options: 'i' } },
			];
		}

		if (query.categoryId) {
			filter.categoryId = query.categoryId;
		}

		if (query.organizerId) {
			filter.organizerId = query.organizerId;
		}

		if (query.minPrice !== undefined || query.maxPrice !== undefined) {
			filter.price = {};
			if (query.minPrice !== undefined) {
				filter.price.$gte = query.minPrice;
			}
			if (query.maxPrice !== undefined) {
				filter.price.$lte = query.maxPrice;
			}
		}

		if (query.fromDate || query.toDate) {
			filter.date = {};
			if (query.fromDate) {
				filter.date.$gte = query.fromDate;
			}
			if (query.toDate) {
				filter.date.$lte = query.toDate;
			}
		}

		return this.eventModel
			.find(filter)
			.populate('categoryId')
			.populate('organizerId', '-password')
			.exec();
	}

	async findById(id: string): Promise<EventDocument> {
		const event = await this.eventModel
			.findById(id)
			.populate('categoryId')
			.populate('organizerId', '-password')
			.exec();

		if (!event) {
			throw new NotFoundException(`Event with ID ${id} not found`);
		}

		return event;
	}

	async update(id: string, updateEventDto: UpdateEventDto, user: any): Promise<EventDocument> {
		const event = await this.eventModel.findById(id).exec();
		if (!event) {
			throw new NotFoundException(`Event with ID ${id} not found`);
		}

		if (user.role !== 'Admin' && event.organizerId.toString() !== user.userId) {
			throw new ForbiddenException('You are not authorized to update this event');
		}

		if (updateEventDto.categoryId) {
			const categoryExists = await this.categoriesService.findById(updateEventDto.categoryId);
			if (!categoryExists) {
				throw new NotFoundException(`Category with ID ${updateEventDto.categoryId} not found`);
			}
		}

		const updatedEvent = await this.eventModel
			.findByIdAndUpdate(id, { $set: updateEventDto }, { new: true })
			.populate('categoryId')
			.populate('organizerId', '-password')
			.exec();

		if (!updatedEvent) {
			throw new NotFoundException(`Event with ID ${id} not found`);
		}

		return updatedEvent;
	}

	async delete(id: string, user: any): Promise<void> {
		const event = await this.eventModel.findById(id).exec();
		if (!event) {
			throw new NotFoundException(`Event with ID ${id} not found`);
		}

		if (user.role !== 'Admin' && event.organizerId.toString() !== user.userId) {
			throw new ForbiddenException('You are not authorized to delete this event');
		}

		await this.eventModel.findByIdAndDelete(id).exec();
	}
}
