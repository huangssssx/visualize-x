"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    // 配置文件上传后存储的路径
    destination: function (req, file, cb) {
        // NodeJS的两个全局变量
        // console.log(__dirname);  //获取当前文件在服务器上的完整目录
        // console.log(__filename); //获取当前文件在服务器上的完整路径
        cb(null, path_1.default.join(__dirname, '../../public/uploads'));
    },
    // 配置文件上传后存储的路径和文件名
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
