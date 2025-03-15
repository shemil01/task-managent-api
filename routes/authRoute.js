const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')
const {tryCatch} = require('../utils/tryCatch')




router.post('/register',tryCatch(controller.register))
router.post('/login',tryCatch(controller.login))
router.get('/view-profile',tryCatch(controller.viewProfile))
router.all("/refresh-token", tryCatch(controller.refresh));


module.exports = router