import makeWASocket, {
     DisconnectReason,
     useMultiFileAuthState,
     BaileysEventEmitter,
     OrderDetails
     } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import path from 'path';
import { Client, Label, LocalAuth } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth({ 
       dataPath: path.resolve(__dirname, '..', 'whatsapp_web', 'auth_info_multi.json')
     })
});

interface SocketInterface {
    getLabels?: Promise<Label[]>,
    getOrderDetails: (orderId: string, tokenBase64: string) => Promise<OrderDetails>
    ev: BaileysEventEmitter
}

export const connect = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(
        path.resolve(__dirname, '..', 'cache', 'auth_info_multi.json')
    )

    const socket: SocketInterface = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', async () => {
        socket.getLabels = client.getLabels(); 
        // или могли бы передать через EventEmitter, но в таком случае это не было бы передачей нового параметра
    });

    await client.initialize(); // ждём пока иницилизируется для продолжения

    socket.ev.on('connection.update', async update => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                await connect();
            }
        }
    })

    socket.ev.on('creds.update', saveCreds);

    return socket;
}