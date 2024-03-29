import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { CityModule } from './city/city.module';
import { RolesGuard } from './guards/roles.guard';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { StateModule } from './state/state.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AddressModule,
    CityModule,
    StateModule,
    CacheModule,
    AuthModule,
    JwtModule,
    ProductModule,
    CategoryModule,
    CartModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
