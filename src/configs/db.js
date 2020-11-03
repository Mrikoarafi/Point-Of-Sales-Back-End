const mysqlimport = require('mysql2')
const {
    database, host, user
    , password
} = require('../helpers/env')

const connection = mysqlimport.createConnection({
    host,
    user,
    password,
    dateStrings: 'date',
    database
})

module.exports = 
    connection
