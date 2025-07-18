import { Module } from '@nestjs/common';
import { DataServicesModule } from '@/services/data-services/data-services.module';
import { RepositoryModule } from '@/infrastructure/repository/repository.module';
import { PlayerDataUseCase } from '@/use-cases/player-data/player-data.use-case';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DataServicesModule, RepositoryModule],
  providers: [PlayerDataUseCase, JwtService],
  exports: [PlayerDataUseCase],
})
export class PlayerDataUseCasesModule {}