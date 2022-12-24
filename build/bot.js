"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const socket = yield (0, connection_1.connect)();
    socket.ev.on('messages.upsert', (m) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('replying to', m.messages[0].key.remoteJid);
        yield socket.sendMessage(m.messages[0].key.remoteJid, { text: 'Hello there!' });
    }));
    socket.ev.on('connection.update', (m) => __awaiter(void 0, void 0, void 0, function* () {
        if (m.isOnline) {
            // socket.authState.creds.me?.id
        }
    }));
    // client.on('ready', async () => {
    //     console.log('Client is ready!');
    //     const data = await client.getLabels();
    //     console.log('data>>', data);
    // });
    // client.initialize();
});
