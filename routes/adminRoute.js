const express = require('express')
const router = express.Router()
const controller = require('../controllers/adminController')
const {tryCatch} = require('../utils/tryCatch')
const {adminMiddleware, authMiddleware} = require('../middleware/authMiddleware')


router.get('/admin/all-users', authMiddleware ,adminMiddleware,tryCatch(controller.allUsers))
router.get('/admin/user-tasks/:userId',authMiddleware,adminMiddleware, tryCatch(controller.userTask))
router.put('/admin/update-user/:userId',authMiddleware,adminMiddleware,tryCatch(controller.editUser))

router.delete('/admin/delete-user/:userId',authMiddleware,adminMiddleware, tryCatch(controller.deleteUser))
router.get('/admin/all-tasks',authMiddleware, adminMiddleware,tryCatch(controller.viewAllTasks))
router.get('/admin/task-by-id/:taskId',authMiddleware,adminMiddleware, tryCatch(controller.viewTaskById))
router.put('/admin/edit-task/:taskId',authMiddleware,adminMiddleware, tryCatch(controller.editTask))
router.delete('/admin/delete-task/:taskId',authMiddleware,adminMiddleware, tryCatch(controller.deleteTask))

module.exports = router