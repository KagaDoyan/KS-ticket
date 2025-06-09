import { CustomerRoute } from "./customer_rou";
import { provinceRoute } from "./province_rou";
import { ShopRoute } from "./shop_rou";
import { UserRoute } from "./user_rou";
import { BrandRoute } from "./brand_rou";
import { CategoryRoute } from "./category_rou";
import { ItemRoute } from "./item_rou";
import { EngineerRoute } from "./engineer_rou";
import { PriorityGroupRoute } from "./priority_group_rou";
import { PriorityRoute } from "./priority_rou";
import { ModelRoute } from "./model_rou";
import { TicketRoute } from "./ticket_rou";
import { ReportRoute } from "./report_rou";
import { NodeRoute } from "./node_rou";
import { StorageRoute } from "./storage_rou";
import { InventoryRoute } from "./inventory_rou";
import { TeamRou } from "./team_rou";
import { LineRoute } from "./line_rou";
import { MailRecipientRoute } from "./mail_recipient_rou";
import { MailSignatureRoute } from "./mail_signature";
import { CustomerMailerRou } from "./customer_mailer_rou";
import { CustomerEmailRoute } from "./customer_email_rou";

export function MainRoute(app: any) {
    return app
        .group("/user", UserRoute)
        .group("/customer", CustomerRoute)
        .group("/shop", ShopRoute)
        .group("/province", provinceRoute)
        .group("/brand", BrandRoute)
        .group("/category", CategoryRoute)
        .group("/item", ItemRoute)
        .group("/engineer", EngineerRoute)
        .group("/priorityGroup", PriorityGroupRoute)
        .group("/priority", PriorityRoute)
        .group("/model", ModelRoute)
        .group("/ticket", TicketRoute)
        .group("/report", ReportRoute)
        .group("/node", NodeRoute)
        .group("/storage", StorageRoute)
        .group("/inventory", InventoryRoute)
        .group("/team", TeamRou)
        .group("/line", LineRoute)
        .group("/mail_recipient", MailRecipientRoute)
        .group("/mail_signature", MailSignatureRoute)
        .group("/customer_mailer", CustomerMailerRou)
        .group("/customer_email", CustomerEmailRoute)
}