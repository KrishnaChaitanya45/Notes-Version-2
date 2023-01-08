const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllTasks,UpdateTask,getASingleTask,deleteATask,createTask ,uploadOfflineTasks} = require('../controllers/task');
const router = express.Router();
router.route('/offline').post(uploadOfflineTasks);
router.route('/task').post(createTask).get(getAllTasks);
router.route('/task/:id').delete(authMiddleware,deleteATask).patch(authMiddleware,UpdateTask).get(authMiddleware,getASingleTask);
module.exports = router;