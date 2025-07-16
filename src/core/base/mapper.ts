export abstract class Mapper<T, U> {
    abstract toDomain(raw: T): U;
    abstract toPersistence(domain: U): T;
  }