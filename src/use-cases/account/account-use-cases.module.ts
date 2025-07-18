import { Module } from '@nestjs/common';
import { DataServicesModule } from '@/services/data-services/data-services.module';
import { RepositoryModule } from '@/infrastructure/repository/repository.module';
import { AccountUseCase } from '@/use-cases/account/account.use-case';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DataServicesModule, RepositoryModule],
  providers: [AccountUseCase, JwtService],
  exports: [AccountUseCase],
})
export class AccountUseCasesModule {}