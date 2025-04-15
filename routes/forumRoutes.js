const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Cấu hình multer để lưu file trong thư mục tạm
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/thumbnails'); // Thư mục tạm thời để lưu file
	},
	filename: (req, file, cb) => {
		const fileName = Date.now() + path.extname(file.originalname); // Tên file duy nhất
		cb(null, fileName);
	},
});

// Cấu hình multer với giới hạn kích thước file (10MB)
const upload = multer({
	storage: storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file là 10MB
});

// Routes công khai
router.get('/', forumController.getPosts);
router.get('/:id', forumController.getPost);

// Routes yêu cầu xác thực
router.use(authMiddleware);

// Route POST để tạo bài viết
router.post('/', upload.single('thumbnail'), forumController.createPost);

// Like/Unlike bài viết
router.post('/:id/like', forumController.toggleLike);

// Thêm comment
router.post('/:id/comments', forumController.addComment);

// Xóa bài viết
router.delete('/:id', forumController.deletePost);

// Xóa comment
router.delete('/:postId/comments/:commentId', forumController.deleteComment);

// Lấy bài viết chưa duyệt
router.get('/unapproved/all', forumController.getPendingPosts);

// Duyệt bài viết
router.post('/approve/:id', forumController.approvePost);

// Hủy duyệt bài viết
router.post('/reject/:id', forumController.rejectPost);

module.exports = router;
