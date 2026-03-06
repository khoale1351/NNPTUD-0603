var express = require('express');
var router = express.Router();
let Role = require('../schemas/roles');

// CREATE: Thêm mới Role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new Role(req.body);
        let result = await newRole.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ: Lấy tất cả Role (Chỉ lấy những Role chưa bị xóa mềm)
router.get('/', async function (req, res, next) {
    try {
        let roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ: Lấy Role theo ID
router.get('/:id', async function (req, res, next) {
    try {
        let role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: "Role không tồn tại hoặc đã bị xóa" });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE: Cập nhật Role
router.put('/:id', async function (req, res, next) {
    try {
        let role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false }, 
            req.body, 
            { new: true }
        );
        if (!role) return res.status(404).json({ message: "Role không tồn tại hoặc đã bị xóa" });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE: Xóa mềm Role (Cập nhật isDeleted = true)
router.delete('/:id', async function (req, res, next) {
    try {
        let role = await Role.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        if (!role) return res.status(404).json({ message: "Role không tồn tại" });
        res.status(200).json({ message: "Đã xóa mềm Role thành công", data: role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;