import { query } from './pool/mysql_pool'
import { getIp } from '../../utils/index'
import { webPort, port, customHost } from '../../utils/var'

// TypeScript 代码

const ip = getIp()
/***********************************************************************************************
 * 组件管理
 ***********************************************************************************************/

/**
 *
 * @param componentsName
 */
function addComponent (params, callback) {
  console.log('增加数据条目')
  // 测试读取图片
  // const imgBinary = fs.readFileSync(path.resolve(__dirname, 'test.jpeg'))
  const sql = 'INSERT INTO components SET ?'
  // const values = [{ name: 'test01', timeStamp: '1665560950761', icon: imgBinary, webpath: 'http://10.32.122.168/dali/#/screenHome', designpath: 'https://mastergo.com/file/70127793516244?page_id=2467%3A31725' }]
  const values = params
  query(sql, values, (res) => {
    // console.log(res)
    callback(res)
  })
}

/**
 * 获取所有components信息的列表
 * @param callback
 */
function getComponents (callback?:(res:any)=>void) {
  console.log('读取数据条目')
  const sql = 'select * from components where parentId IS NULL'
  const values = []
  query(sql, values, (res) => {
    callback && callback(res)
  })
}

function getComponentById (id:string, callback?:(res:any)=>void) {
  console.log('读取数据条目')
  const sql = 'select * from components where id =?'
  const values = [id]
  query(sql, values, (res) => {
    callback && callback(res)
    // console.log(res[0].icon)
    // fs.writeFileSync(path.resolve(__dirname, 'output.jpeg'), res[0].icon)
  })
}

// eslint-disable-next-line @typescript-eslint/ban-types
function editComponent (params:{name:string, codes:string, timestamp:string, comment:string, type:string, icon:string, id:string, isclear:boolean, scripts:string, globalRegisters:string}, callback?:(res:any)=>void) {
  console.log('修改多个条目')
  const { name, codes, timestamp, comment, icon, id, type, isclear, scripts, globalRegisters } = params
  const sql = icon ? 'UPDATE components SET name=?,codes=?,timestamp=?,comment=?,icon=?,type=? ,scripts=?,globalRegisters=? WHERE id = ?' : isclear ? 'UPDATE components SET name=?,codes=?,timestamp=?,comment=?,icon="",type=?,scripts=? ,globalRegisters=? WHERE id = ?' : 'UPDATE components SET name=?,codes=?,timestamp=?,comment=?,type=?,scripts=?,globalRegisters=?   WHERE id = ?'
  const values = icon ? [name, codes, timestamp, comment, icon, type, scripts, globalRegisters, id] : [name, codes, timestamp, comment, type, scripts, globalRegisters, id]
  query(sql, values, (res) => {
    callback && callback(res)
    console.log('数据库返回', sql)
  })
}

function editFieldById (id:string, fieldName:string, value:string, callback?:(res:any)=>void) {
  console.log('修改一个条目')

  const sql = `UPDATE components SET ${fieldName} = ?  WHERE id = ?`
  const values = [value, id]
  query(sql, values, (res) => {
    callback && callback(res)
  })
}

function deleteComponentById (id:string, callback) {
  console.log('删除一个条目')

  const sql = 'DELETE FROM components WHERE id = ?'
  const values = [id]
  query(sql, values, (res) => {
    callback && callback(res)
  })
}

/***********************************************************************************************
 *图片资源管理
 ***********************************************************************************************/

/**
 * 增加一个图片资源
 */
function addIcon (params, callback) {
  console.log('增加数据条目')
  const sql = 'INSERT INTO icons SET ?'
  const values = params
  query(sql, values, (res) => {
    // console.log(res)

    callback(res)
  })
}

/**
 * 获取所有图片资源信息的列表
 * @param callback
 */
function getIcons (callback?:(res:any)=>void) {
  console.log('读取icons数据条目')
  const sql = 'select * from icons'
  const values = []
  console.log('############', getIp())
  // const ip = getIp()
  query(sql, values, (res) => {
    res.forEach(row => {
      row.icon = `http://${customHost || ip}:${webPort}/${row.icon}`
    })
    callback && callback(res)
  })
}

/**
 * 删除一条图片资源
 * @param id
 * @param callback
 */
function deleteIconById (id:string, callback) {
  console.log('删除一个图片资源条目')
  const sql = 'DELETE FROM icons WHERE id = ?'
  const values = [id]
  query(sql, values, (res) => {
    callback && callback(res)
  })
}

/**
 * 获取一条图片数据
 * @param id
 * @param callback
 */
function getIconById (id:string, callback?:(res:any)=>void) {
  console.log('读取数据条目')
  const sql = 'select * from icons where id =?'
  const values = [id]
  query(sql, values, (res) => {
    res.forEach(row => {
      row.icon = `http://${customHost || ip}:${webPort}/${row.icon}`
    })
    callback && callback(res)
  })
}

/***********************************************************************************************
 * 类型管理
 ***********************************************************************************************/
/**
 * 增加一个类型
 */
function addType (params, callback) {
  console.log('增加类型条目')
  const sql = 'INSERT INTO types SET ?'
  const values = params
  query(sql, values, (res) => {
    // console.log(res)
    callback(res)
  })
}

/**
 * 获取所有图片资源信息的列表
 * @param callback
 */
function getTypes (callback?:(res:any)=>void) {
  console.log('读取icons数据条目')
  const sql = 'select * from types'
  const values = []
  console.log('############', getIp())
  // const ip = getIp()
  query(sql, values, (res) => {
    res.forEach(row => {
      row.icon = `http://${customHost || ip}:${webPort}/${row.icon}`
    })
    callback && callback(res)
  })
}

/**
 * 删除一条类型数据
 * @param id
 * @param callback
 */
function deleteTypeById (id:string, callback) {
  console.log('删除一个类型数据：', id)
  const sql = 'DELETE FROM types WHERE id = ?'
  const values = [id]
  query(sql, values, (res) => {
    callback && callback(res)
  })
}

/**
 * 获取一条类型数据
 * @param id
 * @param callback
 */
function getTypeById (id:string, callback?:(res:any)=>void) {
  console.log('读取数据条目')
  const sql = 'select * from types where id =?'
  const values = [id]
  query(sql, values, (res) => {
    res.forEach(row => {
      row.icon = `http://${customHost || ip}:${webPort}/${row.icon}`
    })
    callback && callback(res)
  })
}

/***
 * 子组件相关代码
 */

/**
 * 获取所有id下的子组件信息的列表
 * @param callback
 */
function getChildrenById (parentId:string, callback?:(res:any)=>void) {
  console.log('读取数据条目')
  const sql = 'select * from components where parentId = ?'
  const values = [parentId]
  query(sql, values, (res) => {
    callback && callback(res)
  })
}
export default {
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
}
