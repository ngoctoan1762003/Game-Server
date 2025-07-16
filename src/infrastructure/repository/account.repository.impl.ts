import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountRepository } from '@/core/repositories/account.repository';
import { Account } from '@/core/domain/entities/account.entity';
import { Account as AccountDocument } from '@/frameworks/data-services/mongo/model/account.model';
import { AccountMapper } from '@/core/domain/mappers/account.mapper';

const accountMapper = new AccountMapper();

@Injectable()
export class AccountRepositoryImpl implements AccountRepository {
  constructor(
    @InjectModel('Account')
    private readonly accountModel: Model<AccountDocument>
  ) {}

  async create(account: Account): Promise<Account> {
    // Convert domain entity to persistence format before saving
    const persistenceAccount = accountMapper.toPersistence(account);
    const createdAccount = await this.accountModel.create(persistenceAccount);
    return accountMapper.toDomain(createdAccount);
  }

  async update(id: string, account: Account): Promise<Account> {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      id,
      account,
      { new: true }
    );
    return accountMapper.toDomain(updatedAccount);
  }

  async delete(id: string): Promise<void> {
    await this.accountModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await this.accountModel.findOne({ email });
    return account ? accountMapper.toDomain(account) : null;
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.accountModel.findById(id);
    return account ? accountMapper.toDomain(account) : null;
  }
}
