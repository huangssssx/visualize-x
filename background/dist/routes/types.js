"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 用于管理图片资源的上传功能
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("../src/db/dataAccess/mysql"));
const router = express_1.default.Router();
// 根据id获取类型条目
router.get('/api/types/list', (req, res) => {
    mysql_1.default.getTypes((rows) => {
        res.send({
            code: 200,
            msg: '获取类型数据列表成功！',
            data: rows
        });
    });
});
// 添加一条类型数据
router.post('/api/types/add', (req, res) => {
    const { comment, name } = req.body;
    mysql_1.default.addType({ name, timestamp: Date.now(), comment }, (response) => {
        // console.log(response)
        if (response.errno) {
            res.send({ code: response.errno, msg: '新增类型失败', data: response });
        }
        else {
            res.send({ code: 200, msg: '新增类型成功', data: response });
        }
    });
});
// 删除一条类型数据
router.post('/api/types/delete', (req, res) => {
    const { id } = req.body;
    mysql_1.default.deleteTypeById(id, () => {
        res.send({ code: 200, msg: '删除类型完成' });
    });
});
// 获取一条类型数据
router.get('/api/icons/getTypeById', (req, res) => {
    const { id } = req.query;
    mysql_1.default.getTypeById(id, (row) => {
        res.send({
            code: 200,
            msg: '获取一条类型数据成功！',
            data: row && row.length > 0 ? row[0] : {}
        });
    });
});
exports.default = router;
