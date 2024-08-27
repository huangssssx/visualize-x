// 创建并使用连接池对象
import mysql from 'mysql2'
const pool = mysql.createPool({
  host: 'alaya.zone',
  port: 3306,
  database: 'screen_coms',
  user: 'root',
  password: 'cestc@123654'
})
/**
 * 使用连接池执行sql语句
 * @param {*} sql
 * @param {*} callback
 */
export function query (sql:string, values:Array<any> = [], callback?:(params:any)=>void) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('与mysql数据库建立连接失败', err)
    } else {
      console.log('与mysql数据库建立连接成功')
      connection.query(sql, values, (err, rows) => {
        if (err) {
          console.log('sql执行失败', err)
          callback && callback(err)
        } else {
        //   console.log(rows)
          callback && callback(rows)
        }
        connection.release()
      })
    }
  })
}

setInterval(() => {
  query('SELECT 1')
}, 1000 * 60 * 60 * 7)
