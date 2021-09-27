const helper = require('./helper')
const { searchUser } = require('./index')

let uid = '10'

// let sql = 'SELECT from_uid,to_uid,message,send_time FROM chat_msg WHERE from_uid = ? or to_uid = ?';

// let sql = 'INSERT INTO chat_user(user_id,username,nickname,password) VALUES(NULL,?,?,?)';
// let sqlParams = ['root', '张三', 1234];

// helper.query(sql, sqlParams)
//     .then((result) => {
//         // const time = new Date(result[0].send_time).toLocaleString()
//         // console.log(time);
//         console.log('success', result);
//     }, (reason) => {
//         console.log('failed', reason);
//     })

searchUser(uid).then((result) => {
    if (result.length > 0) {
        console.log(result);
    }
}).catch((reason) => {
    console.log(reason);
})