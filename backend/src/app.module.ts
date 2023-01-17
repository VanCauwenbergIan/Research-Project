import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ComponentsModule } from './components/components.module';
import { DatabaseSeedModule } from './seed/seed.module';

@Module({
  imports: [BootstrapModule, ComponentsModule, DatabaseSeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
