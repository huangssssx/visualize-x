"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_pool_1 = require("./pool/mysql_pool");
const index_1 = require("../../utils/index");
const var_1 = require("../../utils/var");
// TypeScript 代码
const ip = (0, index_1.getIp)();
/***********************************************************************************************
 * 组件管理
 ***********************************************************************************************/
/**
 *
 * @param componentsName
 */
function addComponent(params, callback) {
    console.log('增加数据条目');
    // 测试读取图片
    // const imgBinary = fs.readFileSync(path.resolve(__dirname, 'test.jpeg'))
    const sql = 'INSERT INTO components SET ?';
    // const values = [{ name: 'test01', timeStamp: '1665560950761', icon: imgBinary, webpath: 'http://10.32.122.168/dali/#/screenHome', designpath: 'https://mastergo.com/file/70127793516244?page_id=2467%3A31725' }]
    const values = params;
    (0, mysql_pool_1.query)(sql, values, (res) => {
        // console.log(res)
        callback(res);
    });
}
/**
 * 获取所有components信息的列表
 * @param callback
 */
function getComponents(callback) {
    console.log('读取数据条目');
    const sql = 'select * from components where parentId IS NULL';
    const values = [];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
    });
}
function getComponentById(id, callback) {
    console.log('读取数据条目');
    const sql = 'select * from components where id =?';
    const values = [id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
        // console.log(res[0].icon)
        // fs.writeFileSync(path.resolve(__dirname, 'output.jpeg'), res[0].icon)
    });
}
// eslint-disable-next-line @typescript-eslint/ban-types
function editComponent(params, callback) {
    console.log('修改多个条目');
    const { name, codes, timestamp, comment, icon, id, type, isclear, scripts, globalRegisters } = params;
    const sql = icon ? 'UPDATE components SET name=?,codes=?,timestamp=?,comment=?,icon=?,type=? ,scripts=?,globalRegisters=? WHERE id = ?' : isclear ? 'UPDATE components SET name=?,codes=?,timestamp=?,comment=?,icon="",type=?,scripts=? ,globalRegisters=? WHERE id = ?' : 'UPDATE components SET name=?,codes=?,timestamp=?,comment=?,type=?,scripts=?,globalRegisters=?   WHERE id = ?';
    const values = icon ? [name, codes, timestamp, comment, icon, type, scripts, globalRegisters, id] : [name, codes, timestamp, comment, type, scripts, globalRegisters, id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
        console.log('数据库返回', sql);
    });
}
function editFieldById(id, fieldName, value, callback) {
    console.log('修改一个条目');
    const sql = `UPDATE components SET ${fieldName} = ?  WHERE id = ?`;
    const values = [value, id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
    });
}
function deleteComponentById(id, callback) {
    console.log('删除一个条目');
    const sql = 'DELETE FROM components WHERE id = ?';
    const values = [id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
    });
}
/***********************************************************************************************
 *图片资源管理
 ***********************************************************************************************/
/**
 * 增加一个图片资源
 */
function addIcon(params, callback) {
    console.log('增加数据条目');
    const sql = 'INSERT INTO icons SET ?';
    const values = params;
    (0, mysql_pool_1.query)(sql, values, (res) => {
        // console.log(res)
        callback(res);
    });
}
/**
 * 获取所有图片资源信息的列表
 * @param callback
 */
function getIcons(callback) {
    console.log('读取icons数据条目');
    const sql = 'select * from icons';
    const values = [];
    console.log('############', (0, index_1.getIp)());
    // const ip = getIp()
    (0, mysql_pool_1.query)(sql, values, (res) => {
        res.forEach(row => {
            row.icon = `http://${var_1.customHost || ip}:${var_1.webPort}/${row.icon}`;
        });
        callback && callback(res);
    });
}
/**
 * 删除一条图片资源
 * @param id
 * @param callback
 */
function deleteIconById(id, callback) {
    console.log('删除一个图片资源条目');
    const sql = 'DELETE FROM icons WHERE id = ?';
    const values = [id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
    });
}
/**
 * 获取一条图片数据
 * @param id
 * @param callback
 */
function getIconById(id, callback) {
    console.log('读取数据条目');
    const sql = 'select * from icons where id =?';
    const values = [id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        res.forEach(row => {
            row.icon = `http://${var_1.customHost || ip}:${var_1.webPort}/${row.icon}`;
        });
        callback && callback(res);
    });
}
/***********************************************************************************************
 * 类型管理
 ***********************************************************************************************/
/**
 * 增加一个类型
 */
function addType(params, callback) {
    console.log('增加类型条目');
    const sql = 'INSERT INTO types SET ?';
    const values = params;
    (0, mysql_pool_1.query)(sql, values, (res) => {
        // console.log(res)
        callback(res);
    });
}
/**
 * 获取所有图片资源信息的列表
 * @param callback
 */
function getTypes(callback) {
    console.log('读取icons数据条目');
    const sql = 'select * from types';
    const values = [];
    console.log('############', (0, index_1.getIp)());
    // const ip = getIp()
    (0, mysql_pool_1.query)(sql, values, (res) => {
        res.forEach(row => {
            row.icon = `http://${var_1.customHost || ip}:${var_1.webPort}/${row.icon}`;
        });
        callback && callback(res);
    });
}
/**
 * 删除一条类型数据
 * @param id
 * @param callback
 */
function deleteTypeById(id, callback) {
    console.log('删除一个类型数据：', id);
    const sql = 'DELETE FROM types WHERE id = ?';
    const values = [id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
    });
}
/**
 * 获取一条类型数据
 * @param id
 * @param callback
 */
function getTypeById(id, callback) {
    console.log('读取数据条目');
    const sql = 'select * from types where id =?';
    const values = [id];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        res.forEach(row => {
            row.icon = `http://${var_1.customHost || ip}:${var_1.webPort}/${row.icon}`;
        });
        callback && callback(res);
    });
}
/***
 * 子组件相关代码
 */
/**
 * 获取所有id下的子组件信息的列表
 * @param callback
 */
function getChildrenById(parentId, callback) {
    console.log('读取数据条目');
    const sql = 'select * from components where parentId = ?';
    const values = [parentId];
    (0, mysql_pool_1.query)(sql, values, (res) => {
        callback && callback(res);
    });
}
exports.default = {
    editComponent,
    addComponent,
    getComponentById,
    getComponents,
    editFieldById,
    deleteComponentById,
    //
    addIcon,
    getIcons,
    deleteIconById,
    getIconById,
    //
    addType,
    getTypes,
    deleteTypeById,
    getTypeById,
    //
    getChildrenById
};
