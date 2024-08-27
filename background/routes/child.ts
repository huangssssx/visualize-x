// 子组件
import express from 'express'
import DB from '../src/db/dataAccess/mysql'
import upload from '../src/utils/upload'
const router = express.Router()

/**
 * 根据id获取project条目
 */
router.get('/api/child/list', (req:any, res) => {
  console.log('###########收到消息')
  const { parentId } = req.query
  DB.getChildrenById(parentId, (rows) => {
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

export default router
