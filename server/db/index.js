var options = require('../../mysql');
var mysql = require('mysql');

function login(username, password) {
    var promise = new Promise(function (resolve, reject) {
        var sql = 'SELECT * FROM chat_user WHERE username = ? and password = ?';
        var modSqlParams = [username, password];

        var connection = mysql.createConnection(options);
        connection.connect();

        connection.query(sql, modSqlParams, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            if (result && typeof result == 'object') {
                resolve(result[0]);
            }
        });

        connection.end();
    })
    promise.then(function (value) {
        return value;
    }, function () { });

    return promise;
}

module.exports = {
    login
};