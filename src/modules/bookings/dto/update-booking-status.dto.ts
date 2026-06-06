import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingStatusDto {
	@ApiProperty({
		description: 'The updated status of the booking',
		enum: ['Pending', 'Confirmed', 'Cancelled'],
		example: 'Confirmed',
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	@IsIn(['Pending', 'Confirmed', 'Cancelled'])
	status!: string;
}
