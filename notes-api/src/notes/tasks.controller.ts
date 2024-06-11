import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthToken, UserAuthToken } from '../auth/auth-token.decorator';
import { NotesService } from './notes.service';
import { AddNoteItem, BaseNoteItem, NotesPath, TaskPath } from './notes.dto';

@ApiTags('Note items')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'Ismeretlen felhasználó'
})
@ApiNotFoundResponse({
  description: 'A megadott jegyzet nem található'
})
@Controller('/notes/:noteId')
export class TasksController {
  constructor(private notes: NotesService) {}

  @ApiOperation({ summary: 'Feladat hozzáadása', description: 'Új feladatot hoz létre a jegyzeten belül' })
  @ApiCreatedResponse({ description: 'A feladat hozzáadása sikeresen megtörtént' })
  @Post()
  addNoteItem(
    @AuthToken() { userId }: UserAuthToken,
    @Param() { noteId }: NotesPath,
    @Body() item: AddNoteItem
  ) {
    return this.notes.addItem(userId, noteId, item);
  }

  @ApiOperation({ summary: 'Feladat módosítása', description: 'Módosítja a feladat nevét és hogy elvégzésre került-e; csak a megadott értéket módosítja' })
  @ApiBody({ type: AddNoteItem })
  @ApiOkResponse({ description: 'A feladat módosítása sikeresen megtörtént' })
  @Patch('/:taskId')
  updateNoteItem(
    @AuthToken() { userId }: UserAuthToken,
    @Param() { noteId, taskId }: TaskPath,
    @Body() item: BaseNoteItem
  ) {
    return this.notes.updateItem(userId, noteId, taskId, item);
  }

  @ApiOperation({ summary: 'Feladat törlése', description: 'Töröl egy meghatározott feladatot a felhasználó jegyzetéről' })
  @ApiNoContentResponse({ description: 'Feladat sikeresen eltávolítva' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ description: 'Érvénytelen azonosító' })
  @Delete('/:taskId')
  async deleteNoteItem(
    @AuthToken() { userId }: UserAuthToken,
    @Param() { noteId, taskId }: TaskPath
  ) {
    await this.notes.removeItem(userId, noteId, taskId);
  }
}