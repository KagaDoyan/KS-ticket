import { CustomerRoute } from "./customer_rou";
import { provinceRoute } from "./province_rou";
import { ShopRoute } from "./shop_rou";
import { UserRoute } from "./user_rou";
import { BrandRoute } from "./brand_rou";
import { CategoryRoute } from "./category_rou";

export function MainRoute(app: any) {
    return app
        .group("/user", UserRoute)
        .group("/customer", CustomerRoute)
        .group("/shop", ShopRoute)
        .group("/province", provinceRoute)
        .group("/brand", BrandRoute)
        .group("/category", CategoryRoute)
}