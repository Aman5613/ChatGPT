const express = require('express');
const authMiddleware = require('../Middleware/auth.middleware');
const { createChat } = require('../Controllers/chat.controller');

const router =  express.Router();

router.post("/", authMiddleware, createChat)


module.exports = router;