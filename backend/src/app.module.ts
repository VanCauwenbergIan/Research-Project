import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ComponentOutputUnion } from './bootstrap/entities/clientMessage';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [BootstrapModule, ComponentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
