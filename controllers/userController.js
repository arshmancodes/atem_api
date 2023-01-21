const db = require('../utils/database');


exports.getAll = (req, res) => {
    db.execute('SELECT * from users').then(([rows, fieldData]) => {
        res.status(200).json({
            data: rows,
            message: "Successfully Retrieved",
            success: true
        })
    }).catch(e => {
        res.status(402).json({
            error: err,
        })
    })
}


exports.postUserData = (req, res) => {
    db.execute("INSERT into users(user_phrase, fcmToken, secret) VALUES (?, ?, ?)", [req.body.user_phrase, req.body.fcmToken, req.body.secret]).then(([rows, fieldData]) => {
        res.status(200).json({
            message: "Successfully Posted",
            success: true
        })
    }).catch(e => {
        res.status(402).json({
            message: "The data has not been posted",
            error: e
        })
    })
}

