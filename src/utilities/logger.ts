export const logger = {
    Info: (message: any) => {
        log('Info', message);
    },
    Warn: (message: any) => {
        log('Warn', message);
    },
    Error: (message: any) => {
        log('Error', message);
    },
    Debug: (message: any) => {
        log('Debug', message);
    }
};

function log(level: string, message: any) {
    let time = new Date().toISOString();
    let formattedMessage;

    if (message instanceof Error) {
        formattedMessage = message.stack || message.message;
    } else if (typeof message === 'object') {
        formattedMessage = JSON.stringify(message);
    } else {
        formattedMessage = message;
    }

    console.log(`{"level":"${level}","msg":"${formattedMessage}","time":"${time}"}`);
}