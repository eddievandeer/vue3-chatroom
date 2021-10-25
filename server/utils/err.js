const chalk = require('chalk')

function mysqlErr(err, res) {
    console.log('')
    console.log(chalk.bgRed.black(' ERROR '), chalk.red(err.message))
    console.dir(err.detail)
    res.status(500).json({ error: '服务器异常，请稍后再试!' });
}

module.exports = {
    mysqlErr
}