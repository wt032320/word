const mysqlCon = require("./opMysql.js");
const formatDate = require("./formatDate.js");
const LRU = require("./LRU");
const cache = new LRU(8000);
const Trie = require("./trie");
const trie = new Trie();
; (async function () {
    for (let i = 0; i < 10000; i++) {
        let randomId = Math.floor(Math.random() * 15000);
        let res = await mysqlCon(`select * from word_table where id = ${randomId}`);
        res[0] && cache.push(res[0].eng_word, res[0]);
    }
    let res = await mysqlCon(`select eng_word from word_table`);
    for (let i = 0; i < res.length; i++) {
        trie.insert(res[i].eng_word);
    }
})();
module.exports = {
    loginFn: function (req) {
        return new Promise((resolve, reject) => {
            mysqlCon(`select id,username,pwd from users where username = '${req.body.username}' and pwd = '${req.body.password}'`)
                .then((res) => {
                    resolve(res);
                }, err => {
                    reject(err);
                });
        })
    },
    registerFn: async function (req, _res) {
        let res = await mysqlCon(`select username from users where username = '${req.body.username}'`);
        if (res.length !== 0) {
            _res.send("该用户名已存在,请重新输入");
            return;
        }
        res = await mysqlCon(`insert into users (username,pwd,register_time) values('${req.body.username}','${req.body.password}','${formatDate()}')`);
        _res.send("注册成功");
        res = await mysqlCon(`select id from users where username = '${req.body.username}' and pwd = '${req.body.password}'`);
        res = await mysqlCon(`create table records_u${res[0].id} (
            id int not null primary key auto_increment,
            word_id int not null,
            user_id int not null,
            v_timestamp char(50),
            is_collect char(1) default 0,
            constraint foreign key fk1 (word_id) references word_table(id) ,
            constraint foreign key fk2 (user_id) references users(id)
			)ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
            `);
    },
    queryWord: function (word, _res) {
        let res = cache.get(word);
        if (!res) {
            console.log("未命中")
            mysqlCon(`select * from word_table where eng_word="${word}"`)
                .then((res) => {
                    res[0] && cache.push(res[0].eng_word, res[0]);
                    _res.send(res[0]);
                }, (err) => {
                    console.log(err)
                });
        }

        else {
            console.log("命中cache");
            _res.send(res);

        }
    },
    queryPlan: async function (_res) {
        let list = ["cet4", "cet6", "kaoyan", "shengben", "gaokao", "zhongkao", "xiaoxue"];
        let records = {};
        for (let i = 0; i < list.length; i++) {
            let res = await mysqlCon(`select count(*) from word_table where ${list[i]} = '1'`);
            records[list[i]] = res[0]["count(*)"];
        }
        _res.send(records);
    },
    queryWordList: async function (count, type, _res) {
        let words = [];
        let res = await mysqlCon(`select * from word_table where ${type} = '1'`);
        words.push(...res.slice(count * 20, count * 20 + 20));
        _res.send(words);
    },
    saveProcess: function (name, process) {
        let keys = Object.keys(process);
        let str = "update users set ";
        keys.forEach((el, i) => {
            str += (el + "=" + process[el].processIndex);
            (i < keys.length - 1) ? (str += ",") : 0;
        })
        str += ` where username = '${name}'`;
        return new Promise((resolve, reject) => {
            mysqlCon(str).then(res => {
                resolve(res);
            });
        })
    },
    getProcessList: function (_res, name) {
        mysqlCon(`select nichen,cet4,cet6,kaoyan,shengben,gaokao,zhongkao,xiaoxue from users where username = '${name}'`)
            .then((res) => {
                _res.send(res[0]);
            })
    },
    userGetWordList: async function (type, _res, name) {
        let res = await mysqlCon(`select id from users where username = '${name}'`);
        let table = "records_u" + res[0].id;
        console.log(table);
        res = await mysqlCon(`select max(word_id) from ${table}`);
        console.log(res);
        let maxId = (res[0]['max(word_id)'] - 1) || 0;
        res = await mysqlCon(`select * from word_table where ${type} = '1' and id >= ${maxId} limit 20`);
        _res.send(res);
    },
    saveRecords: async function (records, _res, name) {
        console.log("saveProcess")
        let uid = await mysqlCon(`select id from users where username='${name}'`);
        for (let i = 0; i < records.length; i++) {
            let word_id = await mysqlCon(`select word_id from ${"records_u" + uid[0].id} where word_id='${records[i].id}'`);
            if (word_id.length === 0) {
                let res = await mysqlCon(`insert into ${"records_u" + uid[0].id} (word_id,user_id,v_timestamp) values(${records[i].id},${uid[0].id},'${formatDate(records[i].timestamp)}')`);
            }
            else {
                let res = await mysqlCon(`update ${"records_u" + uid[0].id} set v_timestamp = '${formatDate(records[i].timestamp)}' where word_id = '${records[i].id}'`);
            }
        }
        _res.send("ok");
    },
    getDayWordList: async function (name, _res) {
        console.log("getDayWordList");
        let res = await mysqlCon(`select id from users where username = '${name}'`);
        res = await mysqlCon(`select word_id,v_timestamp from  ${"records_u" + res[0].id} order by v_timestamp desc limit 100`);
        let day = new Date().getDate();
        console.log(day);

        let ids = res.filter(el => {
            if (el.v_timestamp[8] == '0')
                return el.v_timestamp[9] == day;
            else
                return el.v_timestamp.substr(8, 2) == day;
        });

        let wordList = [];
        for (let i = 0; i < ids.length; i++) {
            res = await mysqlCon(`select eng_word,chinese from word_table where id = ${ids[i].word_id}`);
            wordList.push(res[0]);
        }
        _res.send(wordList);
    },
    guessWord: function (prefix, _res) {
        _res.send(trie.guessWord(prefix));
    }

}