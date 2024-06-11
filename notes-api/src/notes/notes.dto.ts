import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { ToBoolean } from '../decorators/transform.to-boolean';
import { ToDate } from '../decorators/transform.to-date';

export enum NoteColor {
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
  RED = "red",
}

export enum OrderBy {
  DATE_ASC = 'date.ASC',
  DATE_DESC = 'date.DESC',
  NAME_ASC = 'name.ASC',
  NAME_DESC = 'name.DESC',
}

export interface BaseNoteItem {
  label?: string;
  isDone?: boolean;
}

export class AddNoteItem implements BaseNoteItem {
  @ApiProperty({
    type: String,
    description: 'Feladat elnevezése',
    example: 'Buy beer',
  })
  @IsString()
  @MinLength(3, { message: ({ constraints }) => `A jegyzet neve legalább ${constraints[0]} karakter hosszú legyen` })
  @MaxLength(100, { message: 'A feladat hossza legfeljebb 100 karakter lehet' })
  label: string;

  @ApiProperty({
    type: String,
    description: 'Feladat elvégezve',
    example: false,
  })
  @IsBoolean({ message: 'A feladat elvégzésének értéke csak true vagy lehet' })
  isDone: boolean;
}

export class NoteItem extends AddNoteItem {
  @ApiProperty({
    type: String,
    description: 'Feladat azonosítója',
    example: '7708fbd3-7f3e-4393-bb27-1d3e240f2184',
  })
  @IsUUID('all', { message: 'Érvénytelen feladatazonosító' })
  id: string;
}

export interface BaseNote {
  title?: string;
  color?: NoteColor;
  isFavorite?: boolean;
}

interface FullNote extends BaseNote {
  id: string;
  title: string;
  creationDate: Date;
  items: NoteItem[];
}

export class CreateNote implements BaseNote {
  @ApiProperty({
    type: String,
    description: 'Jegyzet neve',
    example: 'TODO list',
  })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(3, { message: ({ constraints }) => `A jegyzet neve legalább ${constraints[0]} karakter hosszú legyen` })
  @MaxLength(100, { message: 'A jegyzet neve maximum 100 karakter hosszú lehet' })
  title: string;

  @ApiProperty({
    description: 'Jegyzet színe',
    example: 'yellow',
    default: NoteColor.YELLOW,
    required: false,
  })
  @IsEnum(NoteColor, { message: ({ value, constraints }) => { return `A megadott szín ('${value}') nem elfogadható; válasszon az alábbiak közül: ${constraints[1]}` } })
  @IsOptional()
  color: NoteColor = NoteColor.YELLOW;

  @ApiProperty({
    type: Boolean,
    description: 'Kedvencnek jelölt',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean({ message: 'A kedvenc mező értéke csak true vagy false lehet' })
  @IsOptional()
  isFavorite: boolean = false;
}

export class Note extends CreateNote implements FullNote {
  @ApiProperty({
    type: String,
    description: 'Jegyzet azonosítója',
    example: '9c328eee-807a-4e6b-bcc3-8188cf16b9c0'
  })
  @IsUUID('all', { message: 'Érvénytelen jegyzetazonosító' })
  id: string;

  @ApiProperty({
    type: String,
    description: 'Jegyzet létrehozásának időpontja',
    example: '2024-03-07T23:55:27.431Z'
  })
  @ToDate()
  @IsDate({ message: 'Hibás dátumformátum' })
  creationDate: Date;

  @ApiProperty({
    type: [NoteItem],
    description: 'Jegyzethez tartozó elemek',
  })
  @ValidateNested()
  items: NoteItem[] = [];

  constructor(rawData: Note) {
    super();
    this.id = rawData.id;
    this.title = rawData.title;
    this.color = rawData.color;
    this.isFavorite = rawData.isFavorite;
    this.creationDate = new Date(rawData.creationDate);
    this.items = rawData.items ?? [];
  }
}

export class SearchNotes {
  @ApiProperty({
    description: 'Keresés jegyzet neve vagy eleme szerint',
    type: String,
    required: false,
  })
  @IsOptional()
  query?: string;

  @ApiProperty({
    description: 'Kedvencnek jelölt',
    type: Boolean,
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @IsBoolean({ message: 'A kedvenc mező értéke csak true vagy false lehet' })
  favorites?: boolean;

  @ApiProperty({
    description: 'Jegyzet színe',
    enum: NoteColor,
    required: false
  })
  @IsOptional()
  @IsEnum(NoteColor, { message: ({ value, constraints }) => { return `A megadott szín ('${value}') nem elfogadható; válasszon az alábbiak közül: ${constraints[1]}` } })
  color?: NoteColor;

  @ApiProperty({
    description: 'Később mint',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Hibás dátumformátum' })
  @ToDate({ hours: 0, minutes: 0, seconds: 0, milliSeconds: 0 })
  after?: Date;

  @ApiProperty({
    description: 'Korábban mint',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Hibás dátumformátum' })
  @ToDate({ hours: 23, minutes: 59, seconds: 59, milliSeconds: 999 })
  before?: Date;

  @ApiProperty({
    description: 'Rendezés - kedvencek előre',
    type: Boolean,
    required: false,
    default: false,
  })
  @ToBoolean()
  @IsBoolean()
  @IsOptional()
  favoritesFirst?: boolean = false;

  @ApiProperty({
    description: 'Rendezés',
    enum: OrderBy,
    required: false,
    default: OrderBy.DATE_DESC
  })
  @IsEnum(OrderBy, { message: ({ value, constraints }) => { return `A megadott rendezés ('${value}') nem elfogadható; válasszon az alábbiak közül: ${constraints[1]}` } })
  @IsOptional()
  orderBy?: OrderBy = OrderBy.DATE_DESC;
}

export class NotesPath {
  @ApiProperty({
    type: String,
    description: 'A jegyzet azonosítója',
    example: '9c328eee-807a-4e6b-bcc3-8188cf16b9c0',
    
  })
  @IsUUID('all', { message: 'Érvénytelen jegyzetazonosító' })
  noteId: string;
}

export class TaskPath extends NotesPath {
  @ApiProperty({
    type: String,
    description: 'A feladat azonosítója',
    example: '7708fbd3-7f3e-4393-bb27-1d3e240f2184'
  })
  @IsUUID('all', { message: 'Érvénytelen feladatazonosító' })
  taskId: string;
}
