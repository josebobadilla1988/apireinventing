const mongoDB = require("../api/database/mdb/mongodb")
const fechaperse = `${new Date().toISOString().substr(0, 10)}`
console.log(fechaperse);
const control = async (query, url, userid) => {
    console.log(query);
    console.log(url);
    console.log(userid);
    const data = {
        "query": query,
        "url": url,
        "userid": userid,
    }
    mongoDB.INSERT_ONE(data, `bitacora_${fechaperse}`)
}


module.exports = {
    control
}