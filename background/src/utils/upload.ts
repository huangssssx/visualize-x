import multer from 'multer'
import path from 'path'
const storage = multer.diskStorage({
  // 配置文件上传后存储的路径
  destination: function (req, file, cb) {
    // NodeJS的两个全局变量
    // console.log(__dirname);  //获取当前文件在服务器上的完整目录
    // console.log(__filename); //获取当前文件在服务器上的完整路径
    cb(null, path.join(__dirname, '../../public/uploads'))
  },
  // 配置文件上传后存储的路径和文件名
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage })

export default upload
