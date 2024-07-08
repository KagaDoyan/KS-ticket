import { UserRoute } from "./user_rou";

export function MainRoute(app: any) {
    return app
        .group("/user", UserRoute)
}