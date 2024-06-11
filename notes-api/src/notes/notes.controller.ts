import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthToken, UserAuthToken } from '../auth/auth-token.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotesService } from './notes.service';
import { BaseNote, CreateNote, Note, NotesPath, SearchNotes } from './notes.dto';

@ApiTags('Notes')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({
  description: 'Ismeretlen felhasználó'
})
@Controller('/notes')
export class NotesController {
  constructor(private notes: NotesService) {}

  @ApiOperation({ summary: 'Felhasználó jegyzetei', description: 'Keresés bejelentkezett felhasználó által rögzített jegyzetek között' })
  @ApiOkResponse({ type: [Note], description: 'A keresési feltételeknek megfelelő jegyzetek listája' })
  @ApiBadRequestResponse({ description: 'Hibás keresési feltételek' })
  @Get()
  searchNotes(
    @AuthToken() { userId }: UserAuthToken,
    @Query() searchParams: SearchNotes
  ): Note[] {
    return this.notes.searchNotes(userId, searchParams);
  }

  @ApiOperation({ summary: 'Új jegyzet létrehozása', description: 'Új jegyzetet készít a felhasználó részére' })
  @ApiBody({ type: CreateNote })
  @ApiCreatedResponse({ type: Note, description: 'A rögzített jegyzet, amely tartalmazza a létrehozás időpontját, az azonosítót és egy üres feladatlistát' })
  @Post()
  addNote(
    @AuthToken() { userId }: UserAuthToken,
    @Body() note: CreateNote
  ): Promise<Note> {
    return this.notes.addNote(userId, note);
  }

  @ApiOperation({ summary: 'Jegyzet lekérdezése', description: 'Bejelentkezett felhasználó megadott azonosítójú jegyzete' })
  @ApiOkResponse({ type: Note, description: 'A keresett jegyzet' })
  @ApiBadRequestResponse({ description: 'Érvénytelen azonosító' })
  @ApiNotFoundResponse({ description: 'A jegyzet nem található' })
  @Get('/:noteId')
  getNote(
    @AuthToken() { userId }: UserAuthToken,
    @Param() { noteId }: NotesPath
  ): Note {
    const note = this.notes.getNote(userId, noteId);
    if (!note) {
      throw new NotFoundException('A jegyzet nem található');
    }
    return note;
  }

  @ApiOperation({ summary: 'Jegyzet módosítása', description: 'Módosítja egy jegyzet név ("title"), szín ("color") és kedvenc ("isFavorite") tulajdonságait. Legalább az egyik információ megadása kötelező.' })
  @ApiBody({ type: CreateNote })
  @ApiOkResponse({ type: Note, description: 'A jegyzet sikeresen módosítva' })
  @ApiBadRequestResponse({ description: 'Hibás bemeneti paraméterek' })
  @Patch('/:noteId')
  async updateNote(
    @AuthToken() { userId }: UserAuthToken,
    @Param() { noteId }: NotesPath,
    @Body() { title, color, isFavorite }: BaseNote
  ): Promise<Note> {
    return this.notes.updateNote(userId, noteId, { title, color, isFavorite });
  }

  @ApiOperation({ summary: 'Jegyzet törlése', description: 'Töröl egy meghatározott elemet a felhasználó jegyzetei közül' })
  @ApiNoContentResponse({ description: 'Jegyzet sikeresen eltávolítva' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBadRequestResponse({ description: 'Érvénytelen azonosító' })
  @ApiNotFoundResponse({ description: 'A megadott jegyzet nem található' })
  @Delete('/:noteId')
  async deleteNote(
    @AuthToken() { userId }: UserAuthToken,
    @Param() { noteId }: NotesPath
  ) {
    await this.notes.deleteNote(userId, noteId);
  }

}
