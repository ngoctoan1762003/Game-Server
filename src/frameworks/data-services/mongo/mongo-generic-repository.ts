import { Model } from 'mongoose';
import { Account as DomainAccount, PlayerData as DomainPlayerData } from '@/core/domain/entities';

export class MongoGenericRepository<T, D> {
  private _repository: Model<T>;
  private _populateOnFind: string[];
  private _mapper: (model: T) => D;

  constructor(
    repository: Model<T>, 
    populateOnFind: string[] = [],
    mapper: (model: T) => D
  ) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
    this._mapper = mapper;
  }

  getAll(): Promise<D[]> {
    return this._repository
      .find()
      .populate(this._populateOnFind)
      .exec()
      .then(models => models.map(this._mapper));
  }

  get(id: any): Promise<D> {
    return this._repository
      .findById(id)
      .populate(this._populateOnFind)
      .exec()
      .then(model => this._mapper(model));
  }

  create(item: D): Promise<D> {
    return this._repository
      .create(item)
      .then(created => this._mapper(created));
  }

  update(id: string, item: D): Promise<D> {
    return this._repository
      .findByIdAndUpdate(id, item, { new: true })
      .then(updated => this._mapper(updated));
  }
}