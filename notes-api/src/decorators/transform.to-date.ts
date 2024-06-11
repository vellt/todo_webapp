import { Transform, TransformFnParams } from 'class-transformer';
import { isDateString } from 'class-validator';

export interface TimeOptions {
  hours: number;
  minutes: number;
  seconds: number;
  milliSeconds: number;
}

export function ToDate({
  hours,
  minutes,
  seconds,
  milliSeconds,
}: Partial<TimeOptions> = {}): (target: any, key: string) => void {
  return Transform(({ value }: TransformFnParams) => {
    if (!(value instanceof Date || isDateString(value))) {
      return null;
    }
    const date = new Date(value);
    typeof hours === 'number' && date.setUTCHours(hours);
    typeof minutes === 'number' && date.setMinutes(minutes);
    typeof seconds === 'number' && date.setSeconds(seconds);
    typeof milliSeconds === 'number' && date.setMilliseconds(milliSeconds);
    return date;
  });
}
