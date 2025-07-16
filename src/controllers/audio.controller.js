const AppError = require("../helpers/error/appError");
const asyncWrapper = require("../helpers/error/asyncWrapper");
const { Audio } = require("../models/audio.model");

let uploadAudioHandler = asyncWrapper(async (req, res, next) => {
    const { title, genre, isPrivate } = req.body;
    const userId = req.user.userId;

    const audioFile = req.files?.audioFile?.[0].filename;
    const coverImage = req.files?.coverImage?.[0].filename;

    if (!audioFile || !coverImage) {
        return next(new AppError('Both audio file and cover image are required', 400));
    }
    const audioURL = `${req.protocol}://${req.get('host')}/uploads/audio/${audioFile}`;
    const coverURL = `${req.protocol}://${req.get('host')}/uploads/images/${coverImage}`;

    const newAudio = await Audio.create({
        title,
        genre,
        audioFile: audioURL,
        coverImage: coverURL,
        isPrivate: isPrivate === 'true',
        uploadedBy: userId
    });
    res.status(201).json({
        sucess: true,
        message: 'Audio uploaded Successfully!!',
        data: newAudio
    });
});


module.exports = {
    uploadAudioHandler
}