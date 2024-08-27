// 用于管理图片资源的上传功能
import express from 'express'
import DB from '../src/db/dataAccess/mysql'
const router = express.Router()

// 根据id获取类型条目
router.get('/api/types/list', (req:any, res) => {
  DB.getTypes((rows) => {
    res.send({
      code: 200,
      msg: '获取类型数据列表成功！',
      data: rows
    })
  })
})

// 添加一条类型数据
router.post('/api/types/add', (req:any, res) => {
  const { comment, name } = req.body
  DB.addType({ name, timestamp: Date.now(), comment }, (response:any) => {
    // console.log(response)
    if (response.errno) {
      res.send({ code: response.errno, msg: '新增类型失败', data: response })
    } else {
      res.send({ code: 200, msg: '新增类型成功', data: response })
    }
  })
})

// 删除一条类型数据
router.post('/api/types/delete', (req:any, res:any) => {
  const { id } = req.body
  DB.deleteTypeById(id, () => {
    res.send({ code: 200, msg: '删除类型完成' })
  })
})

// 获取一条类型数据
router.get('/api/icons/getTypeById', (req:any, res) => {
  const { id } = req.query
  DB.getTypeById(id, (row) => {
    res.send({
      code: 200,
      msg: '获取一条类型数据成功！',
      data: row && row.length > 0 ? row[0] : {}
    })
  })
})

export default router
