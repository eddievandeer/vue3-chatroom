const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { login, register, friendList, userAvatar, profile, searchUser } = require('../db');
const { verifyToken } = require('../utils/verify')

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userDB = login(username, password);

    userDB.then((result) => {
        console.log(result);
        if (!result) {
            res.status(400).json({ error: 'Username or password is wrong!' });
        }
        else {
            const token = jwt.sign({ result }, 'the_secret_key');

            // In a production app, you'll want the secret key to be an environment variable
            res.json({
                uid: result.user_id,
                nickname: result.nickname,
                username: result.username,
                avatar: result.avatar,
                token
            });
        }
    }).catch(() => {
        res.status(400).json({ error: 'Username or password is wrong!' });
    });
})

router.post('/register', (req, res) => {
    const username = req.body.username;
    const nickname = req.body.nickname;
    const password = req.body.password;

    const registerDB = register(username, nickname, password);

    registerDB.then(() => {
        const userDB = login(username, password);

        userDB.then((result) => {
            if (!result) {
                res.status(400).json({ error: 'Username or password is wrong!' });
            }
            else {
                const token = jwt.sign({ result }, 'the_secret_key');

                console.log(result.user_id);
                // In a production app, you'll want the secret key to be an environment variable
                res.json({
                    uid: result.user_id,
                    nickname: result.nickname,
                    username: result.username,
                    avatar: result.avatar,
                    token
                });
            }
        }).catch(() => {
            res.status(400).json({ error: 'Username or password is wrong!' });
        });
    }).catch(() => {
        res.status(400).json({ error: '用户名已被注册!' });
    });
})

router.get('/profile', (req, res) => {
    const uid = req.query.uid;
    const profileDB = profile(uid);

    profileDB.then((result) => {
        if (!result) {
            res.status(400).json({ error: '用户不存在!' });
        }
        else {
            // In a production app, you'll want the secret key to be an environment variable
            res.json({
                profile: result[0]
            });
        }
    }).catch(() => {
        res.status(400).json({ error: '获取用户头像失败!' });
    });
})

router.get('/avatar', (req, res) => {
    const uid = req.query.uid;
    const avatarDB = userAvatar(uid);

    avatarDB.then((result) => {
        if (!result) {
            res.status(400).json({ error: '用户不存在!' });
        }
        else {
            // In a production app, you'll want the secret key to be an environment variable
            res.json({
                uid: result[0].user_id,
                avatar: result[0].avatar
            });
        }
    }).catch(() => {
        res.status(400).json({ error: '获取用户头像失败!' });
    });
})

router.get('/friends', verifyToken, (req, res) => {
    jwt.verify(req.token, 'the_secret_key', err => {
        if (err) {
            res.sendStatus(401);
        } else {
            const uid = req.query.uid
            const friendDB = friendList(uid)

            friendDB.then((result) => {
                if (!result) {
                    res.status(400).json({ error: '用户不存在!' });
                }
                else {
                    res.json({
                        friendList: result
                    });
                }
            }).catch(() => {
                res.status(400).json({ error: '获取用户好友信息失败!' });
            });
        }
    });
})

router.get('/search', (req, res) => {
    const uid = req.query.uid;

    searchUser(uid).then((result) => {
        if(result.length > 0) {
            res.json(result);
        }
        else {
            res.json({
                msg: '找不到该用户！'
            });
        }
    })
})

module.exports = router;