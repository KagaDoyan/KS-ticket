import { ClientConfig, Client, Message } from '@line/bot-sdk';

const config: ClientConfig = {
    channelAccessToken: Bun.env.LINE_SECRET!,
};

const client = new Client(config);

export const Line_svc = {
    async sendMessage(userId: string, messageText: string) {
        try {
            const message: Message = {
                type: 'text',
                text: messageText,
            }
            // Send message
            const res = await client.pushMessage(userId, message);
            console.log('Message sent successfully!');
            return res
        } catch (error) {
            console.error('Error sending message:', error);
            throw error
        }
    }
};