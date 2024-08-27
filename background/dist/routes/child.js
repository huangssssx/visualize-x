"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 子组件
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("../src/db/dataAccess/mysql"));
const router = express_1.default.Router();
/**
 * 根据id获取project条目
 */
router.get('/api/child/list', (req, res) => {
    console.log('###########收到消息');
    const { parentId } = req.query;
    mysql_1.default.getChildrenById(parentId, (rows) => {
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
// router.post('/api/child/add', upload.single('icon'), (req:any, res) => {
//   // 接收普通文本参数
//   const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
//   let { name, codes, comment, type, parentId } = req.body
//   const timestamp = Date.now()
//   type = type || 'default'
//   // console.log(req.body)
//   DB.addComponent({ name, timestamp, codes, icon, comment, type, parentId }, (response:any) => {
//     res.send({ code: 200, msg: '新增成功', data: response })
//   })
// })
exports.default = router;
