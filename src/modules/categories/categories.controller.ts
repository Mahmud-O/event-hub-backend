import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './schemas/category.schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: 'Get all categories',
		description: 'Retrieves a list of all event categories in the database. This endpoint is public and does not require a JWT token.',
	})
	@ApiResponse({
		status: 200,
		description: 'Successfully retrieved list of all categories.',
		type: [Category],
	})
	async findAll(): Promise<Category[]> {
		return this.categoriesService.findAll();
	}

	@ApiBearerAuth()
	@Roles('Admin')
	@Post()
	@ApiOperation({
		summary: 'Create a new category',
		description: 'Creates a new event category. This operation is restricted to users with the Admin role.',
	})
	@ApiConsumes('application/json')
	@ApiResponse({
		status: 201,
		description: 'The category has been successfully created.',
		type: Category,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. The request body is missing required fields or has invalid formats.',
	})
	@ApiResponse({
		status: 401,
		description: 'Unauthorized. Missing or invalid Bearer token.',
	})
	@ApiResponse({
		status: 403,
		description: 'Forbidden. The logged-in user is not an Admin.',
	})
	@ApiResponse({
		status: 409,
		description: 'Conflict. A category with the provided name already exists.',
	})
	async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
		return this.categoriesService.create(createCategoryDto);
	}
}
