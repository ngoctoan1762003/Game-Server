import { Account } from '@/core/domain/entities/account.entity';
import { PlayerData } from '@/core/domain/entities/player-data.entity';
import { AccountRepositoryImpl } from '@/infrastructure/repository/account.repository.impl';
import { PlayerDataRepositoryImpl } from '@/infrastructure/repository/player-data.repository.impl';
import { generateSaltAndHash, validatePassword } from '@/shared/utils/auth.utils';
import { Injectable } from '@nestjs/common';

interface RegisterInput {
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export interface AccountResult {
  success: boolean;
  message: string;
  user?: Account;
}

@Injectable()
export class AccountUseCase {
  constructor(
    private readonly accountRepo: AccountRepositoryImpl,
    private readonly playerDataRepo: PlayerDataRepositoryImpl
  ) {}

  async register(input: RegisterInput): Promise<AccountResult> {
    const existingAccount = await this.accountRepo.findByEmail(input.email);
    if (existingAccount) {
      return {
        success: false,
        message: 'Email is already registered',
      };
    }

    const { salt, hashPassword } = await generateSaltAndHash(input.password);
    const now = new Date();

    const account = Account.create({
      _id: '',
      email: input.email,
      hash_password: hashPassword,
      salt,
      password_reset_token: null,
      reset_token_expire_time: null,
      status: 'normal',
      image: null,
      created_at: now,
      updated_at: now,
    });

    const savedAccount = await this.accountRepo.create(account);

    const playerData = PlayerData.create({
      id: '',
      accountId: savedAccount._id,
      nickname: input.email.split('@')[0],
      clearedStageData: [],
      clearedChapterData: [],
      currentStageData: [],
      ownedUnits: [],
      listUnitSquadSetup: Array(10).fill({}),
    });

    await this.playerDataRepo.create(playerData);

    return {
      success: true,
      message: 'Account created successfully',
      user: savedAccount,
    };
  }

  async login(input: LoginInput): Promise<AccountResult> {
    const account = await this.accountRepo.findByEmail(input.email);
    if (!account) {
      return {
        success: false,
        message: 'Account not found',
      };
    }

    const isValid = await validatePassword(input.password, account.hash_password, account.salt);
    if (!isValid) {
      return {
        success: false,
        message: 'Invalid password',
      };
    }

    return {
      success: true,
      message: 'Login successful',
      user: account,
    };
  }
}
