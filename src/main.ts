import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Event Hub API')
		.setDescription('The Event Hub backend service API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	const port = Number(process.env.PORT ?? 3000);
	await app.listen(port, '0.0.0.0');
	console.log(`Application is running on: http://localhost:${port}/api`);
	console.log(`Swagger UI is available at: http://localhost:${port}/api/docs`);
}

void bootstrap();
