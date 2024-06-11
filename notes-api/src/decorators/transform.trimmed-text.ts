import { Transform } from 'class-transformer';
import { filterXSS, IFilterXSSOptions } from 'xss';

export interface TrimmedTextConfig {
  xssProtected?: boolean;
  xssOptions?: IFilterXSSOptions;
}

export const TrimmedText = (
  { xssProtected, xssOptions }: TrimmedTextConfig = { xssProtected: true },
): PropertyDecorator => {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      const trim = value.trim();
      return xssProtected ? filterXSS(trim, xssOptions) : trim;
    }
    return value;
  });
};
