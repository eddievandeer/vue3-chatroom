var options = require('../../mysql');
var mysql = require('mysql');

function query(sql, sqlParams) {
    const promise = new Promise((resolve, reject) => {
        const connection = mysql.createConnection(options);

        connection.connect();

        connection.query(sql, sqlParams, function (err, result) {
            if (err) {
                reject('[SELECT ERROR] - ' + err.message);
                return;
            }
            if (result && typeof result == 'object') {
                resolve(result);
            }
        });

        connection.end();
    });

    return promise;
}

module.exports = {
    query
}