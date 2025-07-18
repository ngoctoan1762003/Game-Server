import { Entity } from '@/core/base/entity';

export interface AccountProps {
  _id: string;
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

export class Account extends Entity<AccountProps> {
  private constructor(props: AccountProps) {
    super(props);
  }

  static create(props: AccountProps): Account {
    return new Account({
      ...props,
      created_at: props.created_at || new Date(),
      updated_at: props.updated_at || new Date(),
    });
  }

  get _id(): string {
    return this.props._id;
  }

  get email(): string {
    return this.props.email;
  }

  get hash_password(): string {
    return this.props.hash_password;
  }

  get salt(): string {
    return this.props.salt;
  }

  get password_reset_token(): string {
    return this.props.password_reset_token;
  }

  get reset_token_expire_time(): Date {
    return this.props.reset_token_expire_time;
  }

  get status(): string {
    return this.props.status;
  }

  get image(): string {
    return this.props.image;
  }

  get createdAt(): Date {
    return this.props.created_at;
  }

  get updatedAt(): Date {
    return this.props.updated_at;
  }
}
