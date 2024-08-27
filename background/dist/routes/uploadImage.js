"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 用于管理图片资源的上传功能
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("../src/db/dataAccess/mysql"));
const upload_1 = __importDefault(require("../src/utils/upload"));
const router = express_1.default.Router();
/**
 * 根据id获取project条目
 */
router.get('/api/icons/list', (req, res) => {
    mysql_1.default.getIcons((rows) => {
        // console.log('返回条目', rows)
        res.send({
            code: 200,
            msg: '获取图片资源列表成功！',
            data: rows
        });
    });
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
router.post('/api/icons/add', upload_1.default.single('icon'), (req, res) => {
    var _a, _b;
    // 接收普通文本参数
    const icon = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename) ? `uploads/${req.file.filename}` : '';
    let { comment, type } = req.body;
    type = type || 'default';
    // console.log(req.body)
    mysql_1.default.addIcon({ name: (_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.filename, timestamp: Date.now(), icon, comment, type }, (response) => {
        res.send({ code: 200, msg: '新增图片成功', data: response });
    });
});
router.post('/api/icons/batchAdd', upload_1.default.single('icons'), (req, res) => {
    console.log(req.files);
    // 接收普通文本参数
    // const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
    // let { comment, type } = req.body
    // type = type || 'default'
    // // console.log(req.body)
    // DB.addIcon({ name: req?.file?.filename, timestamp: Date.now(), icon, comment, type }, (response:any) => {
    //   res.send({ code: 200, msg: '新增图片成功', data: response })
    // })
});
// router.get('/api/icons/getComponentById', (req:any, res) => {
//   // 接收普通文本参数
//   const { id } = req.query
//   // console.log(req.body)
//   DB.getComponentById(id, (row) => {
//     res.send({
//       code: 200,
//       msg: '获取组件成功！',
//       data: row && row.length > 0 ? row[0] : {}
//     })
//   })
// })
// router.post('/api/icons/editComponent', upload.single('icon'), (req:any, res:any) => {
//   const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
//   let { isclear, name, codes, timestamp, comment, type, id } = req.body
//   type = type || 'default'
//   DB.editComponent({ name, codes, timestamp, comment, type, icon, id, isclear }, () => {
//     res.send({ code: 200, msg: '修改完成' })
//   })
// })
// router.post('/api/icons/edit', (req:any, res:any) => {
//   // 接收普通文本参数
//   const { fieldName, value, id } = req.body
//   DB.editFieldById(id, fieldName, value, () => {
//     res.send({ code: 200, msg: '修改完成' })
//   })
// })
// router.post('/api/icons/editIcon', upload.single('icon'), (req:any, res:any) => {
//   // 接收普通文本参数
//   const { id } = req.body
//   const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
//   DB.editFieldById(id, 'icon', icon, () => {
//     res.send({ code: 200, msg: '修改完成', data: icon })
//   })
// })
router.post('/api/icons/delete', (req, res) => {
    // 接收普通文本参数
    const { id } = req.body;
    console.log('#### 删除：', id);
    mysql_1.default.deleteIconById(id, () => {
        res.send({ code: 200, msg: '删除图片完成' });
    });
});
router.get('/api/icons/getIconById', (req, res) => {
    // 接收普通文本参数
    const { id } = req.query;
    // console.log(req.body)
    mysql_1.default.getIconById(id, (row) => {
        res.send({
            code: 200,
            msg: '获取一条图片资源成功！',
            data: row && row.length > 0 ? row[0] : {}
        });
    });
});
exports.default = router;
// module.exports = router
