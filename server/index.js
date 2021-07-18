const express = require("express");
const app = express();
const bodyparse = require("body-parser");
const { loginFn, registerFn, queryWord, queryPlan, queryWordList,
    saveProcess, getProcessList, userGetWordList, saveRecords, getDayWordList, guessWord } = require("./queryMysql");
const { setToken, verToken } = require('./token.js');
var allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
};
app.use(allowCors);
app.use(bodyparse.urlencoded({ extended: true }));
app.use(bodyparse.json());

app.post("/login", (req, _res) => {
    console.log("/login");
    loginFn(req).then((res) => {

        if (res.length === 0)
            _res.send("账号或密码错误");
        else {
            setToken(res[0].username, res[0].id).
                then((res) => {
                    return _res.json({
                        status: 200,
                        token: res
                    });
                })
        }
    }, err => {
        console.log(err);
    });

});
app.get("/searchword", (req, res) => {
    queryWord(req.query.key, res);
})
app.post("/register", (req, _res) => {
    console.log(req.body);
    registerFn(req, _res);
})
app.get("/allPlans", (req, res) => {
    queryPlan(res);
})
app.get("/getWordList", (req, res) => {
    console.log(req.query);
    queryWordList(req.query.count, req.query.type, res);
})
app.post("/saveProcess", (req, _res) => {
    verToken(req.headers.authorization).then(res => {
        saveProcess(res.name, req.body.processMaps).then(res => {
            _res.send("ok");
        });

    }, err => {
        return _res.json({
            status: 401,
        });
    });

})
app.get("/getProcessList", (req, _res) => {
    verToken(req.headers.authorization).then(res => {
        getProcessList(_res, res.name);
    }, err => {
        return _res.json({
            status: 401,
        });
    });
})
app.get("/userGetWordList", (req, _res) => {
    verToken(req.headers.authorization).then(res => {
        userGetWordList(req.query.type, _res, res.name);
    }, err => {
        return _res.json({
            status: 401,
        });
    });
})
app.post("/saveRecords", (req, _res) => {
    verToken(req.headers.authorization).then(res => {
        saveRecords(req.body.records, _res, res.name);
    }, err => {
        return _res.json({
            status: 401,
        });
    });
})
app.get("/getDayWordList", (req, _res) => {
    verToken(req.headers.authorization).then(res => {
        getDayWordList(res.name, _res);
    }, err => {
        return _res.json({
            status: 401,
        });
    });
})
app.get("/guessWord", (req, _res) => {
    guessWord(req.query.prefix, _res);
})
app.listen(8000, () => {
    console.log("server端run at port : 3000");
});