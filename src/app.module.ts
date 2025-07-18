import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guard/jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AccountController } from './controllers/account.controller';
import { AccountUseCasesModule } from './use-cases/account/account-use-cases.module';
import { PlayerDataController } from './controllers/player-data.controller';
import { PlayerDataUseCasesModule } from './use-cases/player-data/player-data.use-case.module';
import { InventoryController } from './controllers/inventory.controller';
import { InventoryUseCasesModule } from './use-cases/inventory/inventory.use-case.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes ConfigModule available throughout the app
        }),
        MongooseModule.forRoot(process.env.DB_URL),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('SECRET_KEY'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
        AccountUseCasesModule,
        PlayerDataUseCasesModule,
        InventoryUseCasesModule,
    ],
    controllers: [AccountController, PlayerDataController, InventoryController],
  providers: [JwtAuthGuard],
})
export class AppModule {}
