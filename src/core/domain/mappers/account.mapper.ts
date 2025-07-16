import { Mapper } from '@/core/base/mapper';
import { Account } from '../entities/account.entity';
import { Document } from 'mongoose';

interface AccountDocument extends Document {
  email: string;
  hash_password: string;
  salt: string;
  password_reset_token: string;
  reset_token_expire_time: Date;
  status: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

// This is what we store in the database
export interface AccountPersistence extends Document {
  email: string;
  hash_password: string;
  salt: string;
  password_reset_token: string;
  reset_token_expire_time: Date;
  status: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

export class AccountMapper implements Mapper<AccountPersistence, Account> {
  toDomain(raw: Document): Account {
    const accountDocument = raw as AccountDocument;
    return Account.create({
      _id: accountDocument._id.toString(),
      email: accountDocument.email,
      hash_password: accountDocument.hash_password,
      salt: accountDocument.salt,
      password_reset_token: accountDocument.password_reset_token,
      reset_token_expire_time: accountDocument.reset_token_expire_time,
      status: accountDocument.status,
      image: accountDocument.image,
      created_at: accountDocument.created_at,
      updated_at: accountDocument.updated_at
    });
  }

  toPersistence(account: Account): AccountPersistence {
    return {
      email: account.email,
      hash_password: account.hash_password,
      salt: account.salt,
      password_reset_token: account.password_reset_token,
      reset_token_expire_time: account.reset_token_expire_time,
      status: account.status,
      image: account.image,
      created_at: account.props.created_at,
      updated_at: account.props.updated_at
    } as AccountPersistence;
  }
}