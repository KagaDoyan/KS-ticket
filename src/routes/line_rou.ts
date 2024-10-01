import { LineCtrl } from "../controller/line_ctrl";

export function LineRoute(app: any) {
    return app
        .post('/webhook', LineCtrl.webhook)
}