import { Note, NoteColor, NoteItem, OrderBy } from './notes.dto';

type NoteFilter = (note: Note) => boolean;

export enum DateCompare {
  AFTER = 1,
  BEFORE = -1,
}

export class NotesFilters {
  constructor(private lang: string) {}

  byQuery(query?: string): NoteFilter {
    if (!query) {
      return Boolean;
    }
    const search = query.toLocaleLowerCase(this.lang);
    return ({ title, items }: Note) => (
      title.toLocaleLowerCase(this.lang).indexOf(search) > -1 ||
      items?.some(({ label }: NoteItem) => label.toLocaleLowerCase(this.lang).indexOf(search) > -1)
    );
  }

  byTitle(query: string): NoteFilter {
    const search = query.toLocaleLowerCase(this.lang);
    return ({ title }: Note) => title.toLocaleLowerCase(this.lang) === search;
  }

  byFavorite(favorites?: boolean): NoteFilter {
    if (!favorites) {
      return Boolean;
    }
    return ({ isFavorite }: Note) => isFavorite;
  }

  byColor(searchColor?: NoteColor): NoteFilter {
    if (!searchColor) {
      return Boolean;
    }
    return ({ color }: Note) => color === searchColor;
  }

  byDate(date?: Date, compare = DateCompare.AFTER): NoteFilter {
    if (!date) {
      return Boolean;
    }
    return ({ creationDate }: Note) => {
      const diff = creationDate.getTime() - date.getTime();
      return compare === DateCompare.AFTER ? diff >= 0 : diff <= 0;
    };
  }

  orderBy(orderBy: OrderBy = OrderBy.DATE_DESC, favoritesFirst?: boolean): (a: Note, b: Note) => number {
    return (noteA: Note, noteB: Note) => {
      const [field, direction] = orderBy.split('.', 2);
      if (favoritesFirst && noteA.isFavorite !== noteB.isFavorite) {
        return noteA.isFavorite ? 1 : -1;
      }
      let result = 0;
      if (field === 'name') {
        result = noteA.title.localeCompare(noteB.title, this.lang);
      } else if (field === 'date') {
        result = noteA.creationDate.getTime() - noteB.creationDate.getTime();
      }
      return direction === 'ASC' ? result : -result;
    }
  }

}