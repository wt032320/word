var jwt = require('jsonwebtoken');
var signkey = 'kkkddd';

exports.setToken = function (username, userid) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            name: username,
            _id: userid
        }, signkey, { expiresIn: '30d' });
        resolve(token);
    })
}

exports.verToken = function (token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, signkey, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })

    })
}