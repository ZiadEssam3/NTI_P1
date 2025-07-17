const express = require('express');
const { authenticate } = require('../middlewares/auth/authenticate.middleware');
const { authorizeRole } = require('../middlewares/auth/authorizeRoles.middleware');
const asyncWrapper = require('../helpers/error/asyncWrapper');
const { Audio } = require('../models/audio.model');
const { getAllAudiosHandler, deleteAudioByAdminHandler } = require('../controllers/admin.controller');
const validateRequest = require('../middlewares/error/validateRequest');
const router = express.Router();



router.get('/audios', authenticate, authorizeRole('admin'), validateRequest, getAllAudiosHandler);

router.delete("/audios/:audioId", authenticate, authorizeRole("admin"), deleteAudioByAdminHandler);


module.exports = router;