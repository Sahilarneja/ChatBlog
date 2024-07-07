const express = require('express');
const { register, login , setAvatar, getAllUsers} = require('../controllers/userController');

const router = express.Router();
const cors = require('cors'); // Import CORS middleware

// Enable CORS for this router
router.use(cors());

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUsers);
module.exports = router;
