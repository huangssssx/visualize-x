import javascriptManagerUpload from '../src/utils/javascriptManagerUpload'
import express from 'express'
import path from 'path'
import fs from 'fs-extra'
const router = express.Router()
// 用于管理第三方库资源

function getDirectoryStructure (dirPath, level = 0) {
  const files = fs.readdirSync(dirPath)
  const structure = {}
  //   console.log(dirPath)
  files.forEach(file => {
    const filePath = `${dirPath}/${file}`
    const stats = fs.statSync(filePath)
    const isDirectory = stats.isDirectory()

    if (isDirectory) {
      structure[file] = getDirectoryStructure(filePath, level + 1)
    } else {
      structure[file] = { name: file, type: 'file' }
    }
  })

  return structure
}

router.post('/api/javascriptManager/add', javascriptManagerUpload.array('files'), (req:any, res) => {
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

  res.send({ code: 200, msg: '上传成功' })
})

router.post('/api/javascriptManager/delete', (req:any, res) => {
  // 接收普通文本参数
  const { files } = req.body
  for (const file of files) {
    const targetPath = path.join(__dirname, `../public/javascriptManager${file.path}`)
    console.log('#############', targetPath)
    const isExist = fs.pathExistsSync(targetPath)
    console.log('#############isExist:', isExist)
    if (isExist) {
      fs.removeSync(targetPath)
    }
  }

  res.send({ code: 200, msg: '删除成功' })
})

router.post('/api/javascriptManager/addFolder', (req:any, res) => {
  // 接收普通文本参数
  const { folderName, parentPath } = req.body
  const folderPath = path.join(__dirname, `../public/javascriptManager${parentPath}`)
  const isExist = fs.pathExistsSync(folderPath)
  if (isExist) {
    fs.mkdirSync(`${folderPath}/${folderName}`)
  }
  res.send({ code: 200, msg: '增加成功' })
})

router.get('/api/javascriptManager/getTree', (req, res) => {
  res.send({
    code: 200,
    data: getDirectoryStructure(path.join(__dirname, '../public/javascriptManager'))
  })
})

export default router
