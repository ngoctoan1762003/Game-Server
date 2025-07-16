import { Repository } from '@/core/base/repository';
import { Account } from '@/core/domain/entities/account.entity';

export interface AccountRepository extends Repository<Account> {
  findByEmail(email: string): Promise<Account | null>;
}