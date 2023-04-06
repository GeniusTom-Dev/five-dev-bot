const mysql = require("mysql");
let connection

init = function (){
    connection = mysql.createConnection({
        host: '51.75.242.206',
        user: 'u941_WPlLLU1BbF',
        password: 'q@Se0@VV@dQPkNZAtep!gGnM',
        database: 's941_FiveBotDB'
    });
}

addSanction = function(Sanctiontarget, Sanctionauthor, Sanctiontype, Sanctionreason, time){
    if(time){
        let Values = [Sanctiontarget, Sanctionauthor, Sanctiontype, Sanctionreason, time]

        let sql = "INSERT INTO users_sanctions (targetId, authorId, type, reason, time) VALUES (?)";
        connection.query(sql, [Values], function (err, result) {
            if (err) throw err;
        });

    }else{
        let Values = [Sanctiontarget, Sanctionauthor, Sanctiontype, Sanctionreason]

        let sql = "INSERT INTO users_sanctions (targetId, authorId, type, reason) VALUES (?)";
        connection.query(sql, [Values], function (err, result) {
            if (err) throw err;
        });
    }


}

module.exports = {init, addSanction}