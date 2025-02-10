const express = require('express')
const router = express.Router()
const controller = require('../controllers/taskController')
const {tryCatch} = require('../utils/tryCatch')
const {authMiddleware} = require('../middleware/authMiddleware')

router.post('/create-task',authMiddleware,tryCatch(controller.createTask))
router.get('/view-tasks',authMiddleware,tryCatch(controller.viewOwnTasks))
router.get('/view-taskById/:id',authMiddleware,tryCatch(controller.viewTaskById))
router.put('/edit-task/:id',authMiddleware,tryCatch(controller.editTask))
router.delete('/delete-task/:id',authMiddleware,tryCatch(controller.deleteTask))

module.exports  = router


