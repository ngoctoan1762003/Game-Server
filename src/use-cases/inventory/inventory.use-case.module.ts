import { Module } from '@nestjs/common';
import { RepositoryModule } from '@/infrastructure/repository/repository.module';
import { InventoryUseCase } from '@/use-cases/inventory/inventory.use-case';

@Module({
  imports: [RepositoryModule],
  providers: [InventoryUseCase],
  exports: [InventoryUseCase],
})
export class InventoryUseCasesModule {}
