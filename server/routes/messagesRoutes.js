const express = require('express');
const { addMessage, getAllMessage } = require('../controllers/messageController');


const router = express.Router();
const cors = require('cors'); // Import CORS middleware

// Enable CORS for this router
router.use(cors());

router.post("/addmsg", addMessage);
router.post("/getmsg", getAllMessage);

module.exports = router;
