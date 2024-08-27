import express from 'express'
import DB from '../src/db/dataAccess/mysql'
import upload from '../src/utils/upload'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('test', { title: 'Express' })
})

/**
 * 根据id获取project条目
 */
router.get('/api/components/list', (req:any, res) => {
  DB.getComponents((rows) => {
    // console.log('返回条目', rows)
    res.send({
      code: 200,
      msg: '获取项目列表成功！',
      data: rows
    })
  })
  // console.log(req.query.id)
  // res.send(req.query.id)
})

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
router.post('/api/components/add', upload.single('icon'), (req:any, res) => {
  // 接收普通文本参数
  const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
  let { name, codes, comment, type, parentId, scripts } = req.body
  type = type || 'default'
  const timestamp = Date.now()
  // console.log(req.body)
  DB.addComponent({ name, timestamp, codes, icon, comment, type, parentId, scripts }, (response:any) => {
    res.send({ code: 200, msg: '新增成功', data: response })
  })
})

/**
 * 根据id直接获取代码
 */
router.get('/api/components/getComponentCodeById', (req:any, res) => {
  // 接收普通文本参数
  const { id } = req.query
  // console.log(req.body)
  DB.getComponentById(id, (row) => {
    const codes = (row && row.length > 0 ? row[0] : {}).codes
    res.send(codes)
  })
})

router.get('/api/components/getComponentById', (req:any, res) => {
  // 接收普通文本参数
  const { id } = req.query
  // console.log(req.body)
  DB.getComponentById(id, (row) => {
    res.send({
      code: 200,
      msg: '获取组件成功！',
      data: row && row.length > 0 ? row[0] : {}
    })
  })
})

router.post('/api/components/editComponent', upload.single('icon'), (req:any, res:any) => {
  const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
  let { isclear, name, codes, timestamp, comment, type, id, scripts, globalRegisters } = req.body
  type = type || 'default'
  DB.editComponent({ name, codes, timestamp, comment, type, icon, id, isclear, scripts, globalRegisters }, () => {
    res.send({ code: 200, msg: '修改完成' })
  })
})

router.post('/api/components/edit', (req:any, res:any) => {
  // 接收普通文本参数
  const { fieldName, value, id } = req.body
  DB.editFieldById(id, fieldName, value, () => {
    res.send({ code: 200, msg: '修改完成' })
  })
})

router.post('/api/components/editIcon', upload.single('icon'), (req:any, res:any) => {
  // 接收普通文本参数
  const { id } = req.body
  const icon = req?.file?.filename ? `uploads/${req.file.filename}` : ''
  DB.editFieldById(id, 'icon', icon, () => {
    res.send({ code: 200, msg: '修改完成', data: icon })
  })
})

router.post('/api/components/delete', (req:any, res:any) => {
  // 接收普通文本参数
  const { id } = req.body
  console.log('#### 删除：', id)
  DB.deleteComponentById(id, () => {
    res.send({ code: 200, msg: '删除完成' })
  })
})

export default router
// module.exports = router
