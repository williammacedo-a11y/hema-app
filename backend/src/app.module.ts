import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { SearchModule } from './search/search.module';
import { AddressesModule } from './addresses/addresses.module';
import { ProfilesModule } from './profiles/profiles.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ProductsModule,
    CartModule,
    OrdersModule,
    SearchModule,
    AddressesModule,
    ProfilesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
