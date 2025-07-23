const mongoose = require("mongoose");
const AppError = require("../helpers/error/appError");
const asyncWrapper = require("../helpers/error/asyncWrapper");
const { Audio } = require("../models/audio.model");
const fs = require('fs');
const path = require('path');



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

let getPublicAudiosHandler = asyncWrapper(async (req, res, next) => {
    const audios = await Audio.find({ isPrivate: false })
        .select('-__v')
        .sort({ createdAt: -1 });
    if (!audios) return next(new AppError('There is No Audio', 400));

    res.status(200).json({
        sucess: true,
        count: audios.length,
        data: audios
    })
});

let getMyOwnAudiosHandler = asyncWrapper(async (req, res, next) => {
    const userId = req.user.userId;
    const audios = await Audio.find({ uploadedBy: userId })
        .sort({ createdAt: -1 })
    if (!audios) return next(new AppError('There is No Audio', 400));
    res.status(200).json({
        sucess: true,
        count: audios.length,
        data: audios
    })
});

let streamAudioHandler = asyncWrapper(async (req, res, next) => {
    const audioId = req.params.audioId;

    // find the audio by id 
    const audio = await Audio.findById(audioId);
    if (!audio) return next(new AppError('Audio file not found', 404));
    const filename = path.basename(audio.audioFile);
    const filePath = path.join(__dirname, '../../uploads/audio', filename);

    // check if the file exist 
    if (!fs.existsSync(filePath)) return next(new AppError('Audio file not found', 404));

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});

let updateAudioHandler = asyncWrapper(async (req, res, next) => {
    const audioId = req.params.audioId;
    if (!mongoose.Types.ObjectId.isValid(audioId)) {
        return next(new AppError('Invalid audio ID format', 400));
    }
    const userId = req.user.userId;
    const audio = await Audio.findById(audioId);
    if (!audio) return next(new AppError('Audio not found', 404));
    if (audio.uploadedBy.toString() !== userId) {
        return next(new AppError('You are not authorized to update this audio', 403));
    }
    const { title, genre, isPrivate } = req.body;
    if (title) audio.title = title;
    if (genre) audio.genre = genre;
    if (typeof isPrivate !== 'undefined') audio.isPrivate = isPrivate;
    if (req.file) {
        // Optional: delete old image file from disk
        const oldImagePath = path.join(__dirname, '../../uploads/images', path.basename(audio.coverImage));
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }

        const fileName = req.file.filename;
        const imagePath = `${req.protocol}://${req.get('host')}/uploads/images/${fileName}`;
        audio.coverImage = imagePath;
    }

    await audio.save();
    res.status(200).json({
        success: true,
        message: 'Audio updated successfully',
        data: audio,
    });
});

let deleteAudioHandler = asyncWrapper(async (req, res, next) => {
    const audioId = req.params.audioId;
    const userId = req.user.userId;
    const audio = await Audio.findOne({ _id: audioId, uploadedBy: userId });
    if (!audio) {
        return next(new AppError('Audio not found or not owned by user', 404));
    }
    const audioPath = path.join(__dirname, '../../', audio.audioFile.replace(`${req.protocol}://${req.get('host')}/`, ''));
    const imagePath = path.join(__dirname, '../../', audio.coverImage.replace(`${req.protocol}://${req.get('host')}/`, ''));

    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await Audio.findByIdAndDelete(audioId);

    res.status(200).json({
        success: true,
        message: 'Audio file deleted successfully'
    });
});

module.exports = {
    uploadAudioHandler,
    getPublicAudiosHandler,
    getMyOwnAudiosHandler,
    streamAudioHandler,
    updateAudioHandler,
    deleteAudioHandler
}