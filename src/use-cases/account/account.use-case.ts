import { Account } from '@/core/domain/entities/account.entity';
import { PlayerData } from '@/core/domain/entities/player-data.entity';
import { Inventory } from '@/core/domain/entities/inventory.entity';
import { AccountRepositoryImpl } from '@/infrastructure/repository/account.repository.impl';
import { PlayerDataRepositoryImpl } from '@/infrastructure/repository/player-data.repository.impl';
import { InventoryRepositoryImpl } from '@/infrastructure/repository/inventory.repository.impl';
import { generateSaltAndHash, validatePassword } from '@/shared/utils/auth.utils';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
  // For register response
  user?: Account;
  // For login response
  username?: string;
  email?: string;
  image?: string;
  accessToken?: string;
}

@Injectable()
export class AccountUseCase {
  constructor(
    private readonly accountRepo: AccountRepositoryImpl,
    private readonly playerDataRepo: PlayerDataRepositoryImpl,
    private readonly inventoryRepo: InventoryRepositoryImpl,
    private readonly jwtService: JwtService
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
      completedTutorialIds: [],
      // Initialize with default starter unit UE001
      ownedUnits: [{ unitID: 'UE001', level: 1, currentExp: 0, tier: 0 }],
      listUnitSquadSetup: Array(10).fill({}),
    });

    await this.playerDataRepo.create(playerData);

    const inventory = Inventory.create({ id: '', accountId: savedAccount._id, items: [] });
    await this.inventoryRepo.create(inventory);

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

    // Generate access token containing only userId
    const accessToken = this.jwtService.sign(
      { userId: account._id },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1y',
      }
    );
    
    // Derive username (before @) or use email if parsing fails
    const username = account.email.split('@')[0] || account.email;

    return {
      success: true,
      message: 'Login successful',
      username,
      email: account.email,
      image: account.image,
      accessToken,
    };
  }
}
