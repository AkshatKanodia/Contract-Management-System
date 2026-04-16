const express = require('express');
const router = express.Router();
const {
    getContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract,
    getContractHistory
} = require('../controllers/contractController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getContracts)
    .post(protect, createContract);

router.route('/:id')
    .get(protect, getContractById)
    .put(protect, updateContract)
    .delete(protect, admin, deleteContract);

router.route('/:id/history')
    .get(protect, getContractHistory);

module.exports = router;
