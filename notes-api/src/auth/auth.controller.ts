import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ChangePasswordBody,
  LoginRequest,
  LoginResponse,
  RegisterUserRequestBody,
  RegisterUserResponse,
  UpdateUserDataBody,
  User,
  UserResponse,
} from '../users/user.type';
import { UsersService } from '../users/users.service';
import { AuthToken, UserAuthToken } from './auth-token.decorator';

type AuthRequest = FastifyRequest & { user: User };

@ApiTags('Users')
@Controller('/user')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UsersService,
  ) {}

  @ApiOperation({ summary: 'Felhasználó adatai', description: 'Bejelentkezett felhasználó adatainak lekérdezése' })
  @ApiUnauthorizedResponse({ description: 'Hiányzó vagy érvénytelen auth token - belépés szükséges' })
  @ApiOkResponse({ type: RegisterUserResponse, description: 'Felhasználó profilja' })
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @Get()
  public getProfile(@AuthToken() { userId }: UserAuthToken) {
    const { password, ...data } = this.users.findById(userId);
    return data;
  }

  @ApiOperation({ summary: 'Adatok módosítása', description: 'Módosítja a felhasználó adatait, a jelszó és email cím kivételével' })
  @ApiUnauthorizedResponse({ description: 'Hiányzó vagy érvénytelen auth token - belépés szükséges' })
  @ApiOkResponse({ type: RegisterUserResponse, description: 'Módosított felhasználói adatok' })
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @Put()
  public async updateProfile(
    @AuthToken() { userId }: UserAuthToken,
    @Body() updateUserData: UpdateUserDataBody
  ) {
    const { password, ...data } = await this.users.updateUserData(userId, updateUserData);
    return data;
  }

  @ApiOperation({ summary: 'Belépés', description: 'Regisztrált felhasználó beléptetése.' })
  @ApiCreatedResponse({ type: LoginResponse, description: 'JWT Bearer token - 2 órán át érvényes' })
  @ApiUnauthorizedResponse({ description: 'Hibás felhasználónév vagy jelszó' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({
    type: LoginRequest,
  })
  public async login(@Request() req: AuthRequest): Promise<LoginResponse> {
    const accessToken = await this.auth.login(req.user);
    return {
      accessToken,
    };
  }

  @ApiOperation({ summary: 'Regisztráció', description: 'Új felhasználó rögzítése' })
  @ApiConflictResponse({ description: 'Létező felhasználó' })
  @ApiCreatedResponse({ type: RegisterUserResponse })
  @Post()
  @ApiBody({ type: RegisterUserRequestBody })
  public async register(@Body() userData: RegisterUserRequestBody): Promise<UserResponse> {
    const { password, ...user } = await this.users.register(userData);
    return user;
  }

  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Jelszó megváltoztatása', description: 'Megváltoztatja a felhasználó jelszavát' })
  @ApiForbiddenResponse({ description: 'Hibás régi jelszó' })
  @ApiNotFoundResponse({ description: 'A felhasználó nem található' })
  @ApiConflictResponse({ description: 'A régi és új jelszó nem egyezhet meg' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Patch('/login')
  async changePassword(
    @AuthToken() { userId }: UserAuthToken,
    @Body() changePassword: ChangePasswordBody
  ) {
    await this.users.changePassword(userId, changePassword);
  }
}
