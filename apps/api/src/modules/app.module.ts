import { Module } from "@nestjs/common";
import { ShopsModule } from "./shops/shops.module";
import { AuthModule } from "./auth/auth.module";
import { LocationModule } from "./location/location.module";
import { UsersModule } from "./users/users.module";
import { CategoriesModule } from "./categories/categories.module";

@Module({
  imports: [ShopsModule, AuthModule, LocationModule, UsersModule, CategoriesModule],
})
export class AppModule {}
