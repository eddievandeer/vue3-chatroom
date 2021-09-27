const express = require('express');
const router = express.Router();
const { getMessages, addMessage } = require('../db');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/verify')

router.get('/message', verifyToken, (req, res) => {
    jwt.verify(req.token, 'the_secret_key', err => {
        if (err) {
            res.sendStatus(401);
        } else {
            getMessages(req.query.from_uid, req.query.to_uid)
            .then((result) => {
                const _messages = result

                _messages.forEach((_message) => {
                    _message.send_time = new Date(_message.send_time).toLocaleString()
                })

                res.json({
                    messages: JSON.stringify(_messages)
                });
            })
        }
    });
})

router.post('/send', verifyToken, (req, res) => {
    jwt.verify(req.token, 'the_secret_key', err => {
        if (err) {
            res.sendStatus(401);
        } else {
            addMessage(req.body.message, req.body.from_uid, req.body.to_uid)
            .then((result) => {
                res.json(result);
            })
        }
    });
})

router.get('/dashboard', verifyToken, (req, res) => {
    jwt.verify(req.token, 'the_secret_key', err => {
        if (err) {
            res.sendStatus(401);
        } else {
            res.json({
                events: 'events'
            });
        }
    });
})

module.exports = router;