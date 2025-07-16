const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title must be under 100 characters'],
    },
    genre: {
        type: String,
        required: [true, 'Audio file is required'],
        trim: true,
    },
    audioFile: {
        type: String,
        required: [true, 'Cover image is required']
    },
    coverImage: {
        type: String,
        required: [true, '']
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploader is required']
    }
}, { timestamps: true });

const Audio = mongoose.model('Audio', audioSchema);

module.exports = {
    Audio
}