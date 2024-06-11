import { Transform, TransformFnParams } from 'class-transformer';

export function ToBoolean(): (target: any, key: string) => void {
  return Transform(({ value }: TransformFnParams) => {
    const type = typeof value;
    if (type === 'boolean') {
      return value;
    }
    const stringValue = value?.toString()?.toLowerCase();
    if (stringValue === 'true') {
      return true;
    } else if (stringValue === 'false') {
      return false;
    }
    return undefined;
  });
}
