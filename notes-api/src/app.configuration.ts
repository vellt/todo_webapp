import 'dotenv/config';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class Configuration {
  @IsOptional()
  NODE_ENV = 'development';

  @IsOptional()
  API_HOST = '0.0.0.0';

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  API_PORT = 3000;

  @IsOptional()
  @IsString()
  JWT_TOKEN_SECRET = '';

  @IsOptional()
  @IsString()
  LANGUAGE = 'hu-HU';
}

const config = Object.keys(process.env).reduce(
  (conf: Configuration, item: string) => {
    if (item in conf) {
      (conf[item as keyof Configuration] as any) = process.env[item] as any;
    }
    return conf;
  },
  new Configuration(),
);
export default () => config;
