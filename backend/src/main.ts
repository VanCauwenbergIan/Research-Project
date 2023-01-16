import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(+process.env.PORT || 3000);

  console.info(`Welcome to the server.\nVisit ${await app.getUrl()}/graphql`);
}
bootstrap();
