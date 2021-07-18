const mysql = require("mysql");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wt182320..',
    port: '3306',
    database: 'wordapp'
});
connection.connect((res) => {
    console.log("连接数据库成功");
}
)
module.exports = function (sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, res) => {
            if (err)
                reject(err);
            else
                resolve(res);
        })
    })
}
