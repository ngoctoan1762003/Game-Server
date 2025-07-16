import { Controller, Post, Body } from '@nestjs/common';
import { AccountUseCase } from '@/use-cases/account/account.use-case';
import { CreateAccountDto } from '@/shared/dtos/account/create-account.dto';
import { LoginAccountDto } from '@/shared/dtos/account/login-account.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountUseCase: AccountUseCase,) {}

  @Post('signup')
  async signup(@Body() dto: CreateAccountDto) {
    return this.accountUseCase.register({
      email: dto.email,
      password: dto.password,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginAccountDto) {
    return this.accountUseCase.login({
      email: dto.email,
      password: dto.password,
    });
  }
}