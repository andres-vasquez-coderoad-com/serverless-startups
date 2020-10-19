import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StartupController } from './startup/startup.controller';
import { RepositoryService } from './repository/repository.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [AppController, StartupController],
  providers: [AppService, RepositoryService],
})
export class AppModule {
}
