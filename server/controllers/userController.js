const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userNameCheck = await User.findOne({ username });
        if (userNameCheck) {
            return res.status(400).json({ msg: "Username already in use", status: false });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.status(400).json({ msg: "Email already in use", status: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        const { password: _, ...userWithoutPassword } = user._doc; // Destructure to remove password
        return res.status(201).json({ status: true, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong", status: false });
    }
};



module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "Username not found", status: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Incorrect password", status: false });
        }

        const { password: _, ...userWithoutPassword } = user._doc; // Destructure to remove password
        return res.status(200).json({ status: true, user: userWithoutPassword });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong. Please try again later.", status: false });
    }
};


module.exports.setAvatar = async (req, res) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        }, { new: true });
        return res.status(200).json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong", status: false });
    }
};

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select({
            email: 1,
            username: 1,
            avatarImage: 1,
            _id: 1,
        });

        return res.status(200).json({ users });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong", status: false });
    }
};
