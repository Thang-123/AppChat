import express from "express";
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost/chat-app', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    avatar: String
});

const User = mongoose.model('User', userSchema);

// Cấu hình multer để lưu trữ file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(cors());

// Endpoint để đăng ký người dùng mới và upload ảnh đại diện
app.post('/register', upload.single('avatar'), async (req, res) => {
    const { username, email, password } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const newUser = new User({ username, email, password, avatar });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Xử lý các sự kiện của Socket.io
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('LOGIN', (credentials) => {
        const { user, pass } = credentials;

        axios.post('http://140.238.54.136:8080/chat/chat', {
            action: 'onchat',
            data: {
                event: 'LOGIN',
                data: {
                    user: user,
                    pass: pass
                }
            }
        })
            .then(response => {
                const data = response.data;
                if (data.status === 'success') {
                    console.log('Login success:', data);
                    socket.emit('LOGIN_SUCCESS', data);
                } else {
                    console.error('Login failed:', data);
                    socket.emit('LOGIN_FAILED', data);
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                socket.emit('LOGIN_ERROR', error);
            });
    });

    socket.on('SEND_MESSAGE', (messageData) => {
        const { type, to, mes } = messageData;

        axios.post('http://140.238.54.136:8080/chat/chat', {
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: type,
                    to: to,
                    mes: mes
                }
            }
        })
            .then(response => {
                const data = response.data;
                if (data.status === 'success') {
                    io.emit('RECEIVE_MESSAGE', data);
                } else {
                    console.error('Send message failed:', data);
                }
            })
            .catch(error => {
                console.error('Send message error:', error);
            });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
