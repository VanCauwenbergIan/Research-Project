import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { ComponentsModule } from './components/components.module';
import { DatabaseSeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BootstrapModule,
    ComponentsModule,
    DatabaseSeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
