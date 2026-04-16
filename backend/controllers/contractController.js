const Contract = require('../models/Contract');
const ContractVersion = require('../models/ContractVersion');

// @desc    Get all contracts
// @route   GET /api/contracts
// @access  Private
const getContracts = async (req, res) => {
    try {
        const { search, status, startDate, endDate, sortBy, page = 1, limit = 10 } = req.query;
        
        let query = { isDeleted: false };
        if (req.user.role !== 'Admin') {
            query.createdBy = req.user._id;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { parties: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (status) {
            query.status = status;
        }
        
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        let sortOption = { createdAt: -1 }; // Default sort
        if (sortBy === 'updatedAt') {
            sortOption = { updatedAt: -1 };
        } else if (sortBy === 'createdAt_asc') {
            sortOption = { createdAt: 1 };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const contracts = await Contract.find(query)
            .populate('createdBy', 'username')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Contract.countDocuments(query);
        
        res.json({
            contracts,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get contract by ID
// @route   GET /api/contracts/:id
// @access  Private
const getContractById = async (req, res) => {
    try {
        const contract = await Contract.findOne({ _id: req.params.id, isDeleted: false })
            .populate('createdBy', 'username');
            
        if (contract) {
            if (req.user.role !== 'Admin' && contract.createdBy._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this contract' });
            }
            res.json(contract);
        } else {
            res.status(404).json({ message: 'Contract not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create contract
// @route   POST /api/contracts
// @access  Private
const createContract = async (req, res) => {
    try {
        const { title, description, parties, startDate, endDate, status } = req.body;
        
        const contract = new Contract({
            title,
            description,
            parties,
            startDate,
            endDate,
            status: status || 'Draft',
            createdBy: req.user._id
        });
        
        const createdContract = await contract.save();
        res.status(201).json(createdContract);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update contract
// @route   PUT /api/contracts/:id
// @access  Private
const updateContract = async (req, res) => {
    try {
        const contract = await Contract.findOne({ _id: req.params.id, isDeleted: false });
        
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        if (req.user.role !== 'Admin' && contract.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this contract' });
        }

        // Before updating, save a snapshot in ContractVersion
        const versionCount = await ContractVersion.countDocuments({ contractId: contract._id });
        const snapshot = contract.toObject();
        delete snapshot._id;
        delete snapshot.__v;

        await ContractVersion.create({
            contractId: contract._id,
            versionNumber: versionCount + 1,
            snapshot,
            updatedBy: req.user._id
        });

        const { title, description, parties, startDate, endDate, status } = req.body;
        
        if (title) contract.title = title;
        if (description !== undefined) contract.description = description;
        if (parties) contract.parties = parties;
        if (startDate) contract.startDate = startDate;
        if (endDate) contract.endDate = endDate;
        if (status) contract.status = status;
        
        const updatedContract = await contract.save();
        res.json(updatedContract);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete contract (soft delete)
// @route   DELETE /api/contracts/:id
// @access  Private/Admin
const deleteContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }
        
        contract.isDeleted = true;
        await contract.save();
        
        res.json({ message: 'Contract removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get contract history
// @route   GET /api/contracts/:id/history
// @access  Private
const getContractHistory = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);
        if (!contract) return res.status(404).json({ message: 'Contract not found' });
        
        if (req.user.role !== 'Admin' && contract.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view history' });
        }

        const history = await ContractVersion.find({ contractId: req.params.id })
            .sort({ versionNumber: -1 })
            .populate('updatedBy', 'username');
            
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract,
    getContractHistory
};