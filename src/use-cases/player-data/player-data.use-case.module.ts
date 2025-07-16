import { Module } from '@nestjs/common';
import { DataServicesModule } from '@/services/data-services/data-services.module';
import { RepositoryModule } from '@/infrastructure/repository/repository.module';
import { PlayerDataUseCase } from '@/use-cases/player-data/player-data.use-case';

@Module({
  imports: [DataServicesModule, RepositoryModule],
  providers: [PlayerDataUseCase],
  exports: [PlayerDataUseCase],
})
export class PlayerDataUseCasesModule {}