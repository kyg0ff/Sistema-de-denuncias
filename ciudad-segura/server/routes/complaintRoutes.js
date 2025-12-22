const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// GET /api/complaints
router.get('/', complaintController.getAllComplaints);

// GET /api/complaints/:id
router.get('/:id', complaintController.getComplaintById);

// POST /api/complaints
router.post('/', complaintController.createComplaint);

module.exports = router;