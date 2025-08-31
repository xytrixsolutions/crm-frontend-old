import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CustomException } from '../common/exceptions/custom-exception';
import { AuthenticatedUser } from './interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import {
  CreateUserInterface,
  LoginUserInterface,
} from '../user/interfaces/create-user.interface';
import { User } from '../user/entities/user.entity';
import { hashPassword } from '../common/helpers/hashPassword';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(loggedInUser: LoginUserInterface): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByEmailAndRole(
      loggedInUser.email,
      loggedInUser.role,
    );

    const existingToken = await this.tokenRepository.findOne({
      where: { user: { id: user?.id }, ipAddress: loggedInUser.ipAddress },
    });

    if (
      existingToken &&
      this.configService.get<string>('NODE_ENV') === 'local'
    ) {
      throw new CustomException(
        'You already have an active session',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const condition =
      user && (await bcrypt.compare(loggedInUser.password, user.password));

    if (!condition) {
      throw new CustomException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.getTokens(user.id, user.email);

    // Save token in DB
    const savedToken = await this.saveToken({
      deviceToken: loggedInUser.deviceToken,
      ipAddress: loggedInUser.ipAddress,
      user: user,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt:
        Date.now() +
        this.configService.get<number>('ACCESS_TOKEN_EXPIRY')! * 1000,
      refreshTokenExpiresAt:
        Date.now() +
        this.configService.get<number>('REFRESH_TOKEN_EXPIRY')! * 1000,
    });

    const userWithoutPassword = plainToInstance(User, user);
    return {
      ...userWithoutPassword,
      token: plainToInstance(Token, savedToken),
    } as unknown as AuthenticatedUser;
  }

  async create(createUser: CreateUserInterface): Promise<AuthenticatedUser> {
    const hashedPassword = await hashPassword(createUser.password);

    const user = await this.usersService.create({
      ...createUser,
      password: hashedPassword,
    });
    const tokens = await this.getTokens(user.id, user.email);

    const savedToken = await this.saveToken({
      deviceToken: createUser.deviceToken,
      ipAddress: createUser.ipAddress,
      user: user,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt:
        Date.now() +
        this.configService.get<number>('ACCESS_TOKEN_EXPIRY')! * 1000,
      refreshTokenExpiresAt:
        Date.now() +
        this.configService.get<number>('REFRESH_TOKEN_EXPIRY')! * 1000,
    });

    const userWithoutPassword = plainToInstance(User, user);
    return {
      ...userWithoutPassword,
      token: plainToInstance(Token, savedToken),
    } as unknown as AuthenticatedUser;
  }

  async logout(userId: number): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!token) {
      throw new CustomException('Token not found', HttpStatus.NOT_FOUND);
    }
    await this.tokenRepository.remove(token);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: Number(
            this.configService.get<number>('ACCESS_TOKEN_EXPIRY'),
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: Number(
            this.configService.get<number>('REFRESH_TOKEN_EXPIRY'),
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(payload: {
    deviceToken?: string;
    ipAddress: string;
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: number;
    refreshTokenExpiresAt: number;
  }) {
    const newToken = this.tokenRepository.create({
      ...payload,
    });

    return this.tokenRepository.save(newToken);
  }

  async findAllTokens(userId?: number): Promise<Token[]> {
    const tokens = await this.tokenRepository.find({
      where: userId ? { user: { id: userId } } : {},
    });
    return tokens;
  }

  async deleteToken(tokenId: number) {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId },
    });
    if (token) {
      return this.tokenRepository.remove(token);
    }
  }

  async refreshTokens(refreshToken: string): Promise<Token | null> {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!token) {
      throw new CustomException('Token not found', HttpStatus.NOT_FOUND);
    }

    if (!token.user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    const tokens = await this.getTokens(token.user.id, token.user.email);

    token.token = tokens.accessToken;
    token.refreshToken = tokens.refreshToken;
    token.expiresAt =
      Date.now() +
      this.configService.get<number>('ACCESS_TOKEN_EXPIRY')! * 1000;
    token.refreshTokenExpiresAt =
      Date.now() +
      this.configService.get<number>('REFRESH_TOKEN_EXPIRY')! * 1000;

    const newToken = await this.tokenRepository.save(token);
    const res = plainToInstance(Token, newToken);

    return res;
  }
}
