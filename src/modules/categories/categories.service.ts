import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
	findAll(): Array<{ message: string }> {
		return [{ message: 'categories-ready' }];
	}
}
