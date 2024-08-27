"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIp = void 0;
const os_1 = __importDefault(require("os"));
const getIp = () => {
    const netDict = os_1.default.networkInterfaces();
    for (const devName in netDict) {
        const netList = netDict[devName];
        for (let i = 0; i < netList.length; i++) {
            const { address, family, internal, mac } = netList[i];
            if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                return address;
            }
        }
    }
};
exports.getIp = getIp;
