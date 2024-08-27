"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("../src/db/dataAccess/mysql"));
const upload_1 = __importDefault(require("../src/utils/upload"));
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('test', { title: 'Express' });
});
/**
 * 根据id获取project条目
 */
router.get('/api/components/list', (req, res) => {
    mysql_1.default.getComponents((rows) => {
        // console.log('返回条目', rows)
        res.send({
            code: 200,
            msg: '获取项目列表成功！',
            data: rows
        });
    });
    // console.log(req.query.id)
    // res.send(req.query.id)
});
// 添加商品
/**
 * {
  fieldname: 'file',
  originalname: '921E8097-C75E-4A04-B907-57CCDE804758.dmp',
  encoding: '7bit',
  mimetype: 'application/octet-stream',
  destination: '/Users/huangssssx/Documents/workspace/cestc-screen-history-background/public/uploads',
  filename: '1665629059281.dmp',
  path: '/Users/huangssssx/Documents/workspace/cestc-screen-history-background/public/uploads/1665629059281.dmp',
  size: 20192
}
 */
router.post('/api/components/add', upload_1.default.single('icon'), (req, res) => {
    var _a;
    // 接收普通文本参数
    const icon = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename) ? `uploads/${req.file.filename}` : '';
    let { name, codes, comment, type, parentId, scripts } = req.body;
    type = type || 'default';
    const timestamp = Date.now();
    // console.log(req.body)
    mysql_1.default.addComponent({ name, timestamp, codes, icon, comment, type, parentId, scripts }, (response) => {
        res.send({ code: 200, msg: '新增成功', data: response });
    });
});
/**
 * 根据id直接获取代码
 */
router.get('/api/components/getComponentCodeById', (req, res) => {
    // 接收普通文本参数
    const { id } = req.query;
    // console.log(req.body)
    mysql_1.default.getComponentById(id, (row) => {
        const codes = (row && row.length > 0 ? row[0] : {}).codes;
        res.send(codes);
    });
});
router.get('/api/components/getComponentById', (req, res) => {
    // 接收普通文本参数
    const { id } = req.query;
    // console.log(req.body)
    mysql_1.default.getComponentById(id, (row) => {
        res.send({
            code: 200,
            msg: '获取组件成功！',
            data: row && row.length > 0 ? row[0] : {}
        });
    });
});
router.post('/api/components/editComponent', upload_1.default.single('icon'), (req, res) => {
    var _a;
    const icon = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename) ? `uploads/${req.file.filename}` : '';
    let { isclear, name, codes, timestamp, comment, type, id, scripts, globalRegisters } = req.body;
    type = type || 'default';
    mysql_1.default.editComponent({ name, codes, timestamp, comment, type, icon, id, isclear, scripts, globalRegisters }, () => {
        res.send({ code: 200, msg: '修改完成' });
    });
});
router.post('/api/components/edit', (req, res) => {
    // 接收普通文本参数
    const { fieldName, value, id } = req.body;
    mysql_1.default.editFieldById(id, fieldName, value, () => {
        res.send({ code: 200, msg: '修改完成' });
    });
});
router.post('/api/components/editIcon', upload_1.default.single('icon'), (req, res) => {
    var _a;
    // 接收普通文本参数
    const { id } = req.body;
    const icon = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename) ? `uploads/${req.file.filename}` : '';
    mysql_1.default.editFieldById(id, 'icon', icon, () => {
        res.send({ code: 200, msg: '修改完成', data: icon });
    });
});
router.post('/api/components/delete', (req, res) => {
    // 接收普通文本参数
    const { id } = req.body;
    console.log('#### 删除：', id);
    mysql_1.default.deleteComponentById(id, () => {
        res.send({ code: 200, msg: '删除完成' });
    });
});
exports.default = router;
// module.exports = router
