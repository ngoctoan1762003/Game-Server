import { Module } from '@nestjs/common';
import { DataServicesModule } from '@/services/data-services/data-services.module';
import { RepositoryModule } from '@/infrastructure/repository/repository.module';
import { AccountUseCase } from '@/use-cases/account/account.use-case';

@Module({
  imports: [DataServicesModule, RepositoryModule],
  providers: [AccountUseCase],
  exports: [AccountUseCase],
})
export class AccountUseCasesModule {}