import { CallbackRequest } from "@line/bot-sdk/dist/webhook/api";
import { Line_svc } from "../services/line_svc";

export const LineCtrl = {

    async webhook(ctx: any) {
        const callback = ctx.body;
        for (const event of callback.events) {
            if (event.message.text == "poke") {
                console.log(event.message.text)                
                Line_svc.sendMessage(Bun.env.LINE_GROUP!, `Info\nMessage: ${event.message.text}\nUser: ${event.source.userId}\nGroup: ${event.source.groupId || ''}`);
            }
        }
        return "ok"
    },
}