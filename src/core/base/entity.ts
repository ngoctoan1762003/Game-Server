export abstract class Entity<T> {
    protected constructor(public readonly props: T) {}
  }