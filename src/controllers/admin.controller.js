const path = require("path");
const AppError = require("../helpers/error/appError");
const asyncWrapper = require("../helpers/error/asyncWrapper");
const { Audio } = require("../models/audio.model");

let getAllAudiosHandler = asyncWrapper(async (req, res, next) => {
    const audios = await Audio.find().populate('uploadedBy', 'username email');
    if (audios.length === 0) return next(new AppError('No audio files found', 404));
    res.status(200).json({
        success: true,
        count: audios.length,
        data: audios
    });
});

let deleteAudioByAdminHandler = asyncWrapper(async (req, res, next) => {
    const audioId = req.params.audioId;

    const audio = await Audio.findById(audioId);
    if (!audio) {
        return next(new AppError("Audio not found", 404));
    }

    // Delete the file from the uploads folder
    if (audio.file) {
        const filePath = path.join(__dirname, "..", "uploads", "audio", audio.file);
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                return next(new AppError("Error deleting audio file from server", 500));
            }
        });
    }

    // Delete from database
    await Audio.findByIdAndDelete(audioId);

    res.status(200).json({
        success: true,
        message: "Audio deleted successfully by admin",
    });
});

module.exports = {
    getAllAudiosHandler,
    deleteAudioByAdminHandler
}