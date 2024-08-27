"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const javascriptManagerUpload_1 = __importDefault(require("../src/utils/javascriptManagerUpload"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const router = express_1.default.Router();
// 用于管理第三方库资源
function getDirectoryStructure(dirPath, level = 0) {
    const files = fs_extra_1.default.readdirSync(dirPath);
    const structure = {};
    //   console.log(dirPath)
    files.forEach(file => {
        const filePath = `${dirPath}/${file}`;
        const stats = fs_extra_1.default.statSync(filePath);
        const isDirectory = stats.isDirectory();
        if (isDirectory) {
            structure[file] = getDirectoryStructure(filePath, level + 1);
        }
        else {
            structure[file] = { name: file, type: 'file' };
        }
    });
    return structure;
}
router.post('/api/javascriptManager/add', javascriptManagerUpload_1.default.array('files'), (req, res) => {
    // const files = req.files
    // const { rootPath } = req.body
    // console.log('############:', rootPath)
    // 接收普通文本参数
    //   const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
    //   let { comment, type } = req.body
    //   type = type || 'default'
    // console.log(req.body)
    //   DB.addIcon({ name: req?.file?.filename, timestamp: Date.now(), icon, comment, type }, (response:any) => {
    //     res.send({ code: 200, msg: '新增图片成功', data: response })
    //   })
    res.send({ code: 200, msg: '上传成功' });
});
router.post('/api/javascriptManager/delete', (req, res) => {
    // 接收普通文本参数
    const { files } = req.body;
    for (const file of files) {
        const targetPath = path_1.default.join(__dirname, `../public/javascriptManager${file.path}`);
        console.log('#############', targetPath);
        const isExist = fs_extra_1.default.pathExistsSync(targetPath);
        console.log('#############isExist:', isExist);
        if (isExist) {
            fs_extra_1.default.removeSync(targetPath);
        }
    }
    res.send({ code: 200, msg: '删除成功' });
});
router.post('/api/javascriptManager/addFolder', (req, res) => {
    // 接收普通文本参数
    const { folderName, parentPath } = req.body;
    const folderPath = path_1.default.join(__dirname, `../public/javascriptManager${parentPath}`);
    const isExist = fs_extra_1.default.pathExistsSync(folderPath);
    if (isExist) {
        fs_extra_1.default.mkdirSync(`${folderPath}/${folderName}`);
    }
    res.send({ code: 200, msg: '增加成功' });
});
router.get('/api/javascriptManager/getTree', (req, res) => {
    res.send({
        code: 200,
        data: getDirectoryStructure(path_1.default.join(__dirname, '../public/javascriptManager'))
    });
});
exports.default = router;
