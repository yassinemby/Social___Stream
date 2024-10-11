const mongoose = require('mongoose');

const socketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    socketId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' }, // Expire socket records after a day
});

const Socket = mongoose.model('Socket', socketSchema);

module.exports = Socket;
