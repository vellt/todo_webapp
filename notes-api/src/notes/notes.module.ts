import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [NotesController, TasksController],
  imports: [AuthModule, ConfigModule],
  exports: [NotesService],
  providers: [NotesService],
})
export class NotesModule {}