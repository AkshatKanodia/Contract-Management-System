const mongoose = require('mongoose');

const contractVersionSchema = new mongoose.Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },
    versionNumber: {
        type: Number,
        required: true
    },
    snapshot: {
        type: Object, // Stores complete state of the contract before update
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ContractVersion', contractVersionSchema);
