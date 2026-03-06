var express = require('express');
var router = express.Router();

/* GET users listing. */
///api/v1/users
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
var express = require('express');
var router = express.Router();
let User = require('../schemas/users');

// CREATE: Thêm mới User
router.post('/', async function (req, res, next) {
    try {
        let newUser = new User(req.body);
        let result = await newUser.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ: Lấy tất cả User (populate role)
router.get('/', async function (req, res, next) {
    try {
        let users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Lấy User theo ID (populate role)
router.get('/:id', async function (req, res, next) {
    try {
        let user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).json({ message: "User không tồn tại hoặc đã bị xóa" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE: Cập nhật User
router.put('/:id', async function (req, res, next) {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User không tồn tại hoặc đã bị xóa" });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Xóa mềm User
router.delete('/:id', async function (req, res, next) {
    try {
        let user = await User.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User không tồn tại" });
        res.status(200).json({ message: "Đã xóa mềm User thành công", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API MỚI: ENABLE USER
router.post('/enable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ message: "Vui lòng cung cấp cả email và username" });
        }

        let user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Thông tin không đúng hoặc User không tồn tại" });
        res.status(200).json({ message: "Đã kích hoạt (enable) thành công", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API MỚI: DISABLE USER
router.post('/disable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ message: "Vui lòng cung cấp cả email và username" });
        }

        let user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Thông tin không đúng hoặc User không tồn tại" });
        res.status(200).json({ message: "Đã vô hiệu hóa (disable) thành công", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;