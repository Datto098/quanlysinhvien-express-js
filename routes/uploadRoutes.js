const express = require('express');
const router = express.Router();
const multer = require('multer');
// Cấu hình Multer để lưu trữ ảnh

// Cấu hình storage của multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/comments'); // Chỉ định thư mục lưu trữ file
	},
	filename: function (req, file, cb) {
		const ext = file.mimetype.split('/')[1]; // Đặt đuôi file là .jpg mặc định
		console.log(ext);
		const filename = Date.now() + '.' + ext; // Thêm timestamp vào tên file để tránh trùng lặp
		cb(null, filename); // Đặt tên file
	},
});

// Khởi tạo multer với cấu hình trên
const upload = multer({ storage: storage });

// API upload ảnh
router.post('/image', upload.single('image'), (req, res) => {
	// Kiểm tra xem ảnh có được tải lên hay không
	if (!req.file) {
		return res.status(400).json({ message: 'Không có ảnh được tải lên' });
	}

	// Lấy đường dẫn ảnh
	const imageUrl = `/uploads/comments/${req.file.filename}`;
	res.json({ url: imageUrl });
});

module.exports = router;
