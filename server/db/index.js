const helper = require('./helper');

function login(username, password) {
    let sql = 'SELECT * FROM chat_user WHERE (username = ? or user_id = ?) and password = ?';
    let sqlParams = [username, username, password];

    return helper.query(sql, sqlParams).then((result) => result[0]);
}

function register(username, nickname, password) {
    let sql = 'INSERT INTO chat_user(user_id,username,nickname,password) VALUES(NULL,?,?,?)';
    let sqlParams = [username, nickname, password];

    return helper.query(sql, sqlParams);
}

function profile(uid) {
    let sql = 'SELECT username, nickname, avatar, signature FROM chat_user WHERE (username = ? or user_id = ?)';
    let sqlParams = [uid, uid];

    return helper.query(sql, sqlParams);
}

function getMessages(from_uid, to_uid) {
    let sql = 'SELECT * FROM chat_msg_detail WHERE (from_uid = ? OR to_uid = ?) AND (from_uid = ? OR to_uid = ?) ORDER BY send_time';
    let sqlParams = [from_uid, from_uid, to_uid, to_uid];

    return helper.query(sql, sqlParams);
}

function addMessage(message, from, to) {
    let sql = 'INSERT INTO chat_msg(message_id,message,from_uid,to_uid) VALUES(NULL,?,?,?)';
    let sqlParams = [message, from, to];

    return helper.query(sql, sqlParams);
}

function userAvatar(uid) {
    let sql = 'SELECT user_id, avatar FROM chat_user WHERE user_id = ?';
    let sqlParams = [uid];

    return helper.query(sql, sqlParams);
}

function friendList(uid) {
    let sql = 'SELECT * FROM chat_friend_detail WHERE user_id = ?';
    let sqlParams = [uid];

    return helper.query(sql, sqlParams);
}

function searchUser(uid) {
    let sql = 'SELECT user_id, username, nickname, avatar, signature FROM chat_user WHERE (username like ? or user_id like ?)';
    let sqlParams = ['%' + uid + '%', '%' + uid + '%'];

    return helper.query(sql, sqlParams);
}

function addBuddy(uid, fid) {
    let sql = 'INSERT INTO chat_friend(user_id,friend_id) VALUES(?,?),(?,?)'
    let sqlParams = [uid, fid, fid, uid]

    return helper.query(sql, sqlParams)
}

module.exports = {
    login,
    register,
    profile,
    getMessages,
    addMessage,
    userAvatar,
    friendList,
    searchUser,
    addBuddy
};