const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// JSON 데이터 처리 및 CORS(다른 포트간 통신 허용) 설정
app.use(express.json());
app.use(cors());

// MySQL 데이터베이스 연결 설정 (docker-compose.yml 설정과 동일하게)
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'wiki_user',
    password: 'wiki_password',
    database: 'wikidb'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ MySQL DB 연결 성공!');
});

// ----------------------------------------------------
// [API 1] 로그인 기능 처리
// ----------------------------------------------------
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // DB에서 아이디와 비밀번호가 일치하는 유저 찾기
    const sql = 'SELECT * FROM users WHERE user_name = ? AND user_password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB 에러' });
        
        if (results.length > 0) {
            res.json({ success: true, message: '로그인 성공!' });
        } else {
            res.json({ success: false, message: '아이디나 비밀번호가 틀렸습니다.' });
        }
    });
});

// ----------------------------------------------------
// [API 2] 위키 문서 내용 가져오기 (예: 레벨 0)
// ----------------------------------------------------
app.get('/api/pages/:title', (req, res) => {
    const pageTitle = req.params.title; // URL에서 제목 가져오기
    
    const sql = 'SELECT * FROM pages WHERE title LIKE ?';
    db.query(sql, [`%${pageTitle}%`], (err, results) => {
        if (err) return res.status(500).json({ error: 'DB 에러' });
        
        if (results.length > 0) {
            // 조회수 1 올리기
            db.query('UPDATE pages SET view_count = view_count + 1 WHERE id = ?', [results[0].id]);
            res.json(results[0]); // 찾은 문서 정보를 프론트엔드로 보냄
        } else {
            res.status(404).json({ error: '문서를 찾을 수 없습니다.' });
        }
    });
});

// 서버 켜기
app.listen(port, () => {
    console.log(`🚀 백룸위키 백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
// ----------------------------------------------------
// [API 3] 회원가입 처리 (users 테이블에 저장)
// ----------------------------------------------------
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    
    // 1. 똑같은 아이디가 이미 있는지 중복 검사
    const checkSql = 'SELECT * FROM users WHERE user_name = ?';
    db.query(checkSql, [username], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'DB 에러가 발생했습니다.' });
        
        if (results.length > 0) {
            // 중복된 아이디가 있는 경우
            return res.json({ success: false, message: '이미 존재하는 요원 ID입니다.' });
        }
        
        // 2. 중복이 없다면 테이블에 새 요원 정보 집어넣기
        const insertSql = 'INSERT INTO users (user_name, user_password) VALUES (?, ?)';
        db.query(insertSql, [username, password], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'DB 저장 실패' });
            
            res.json({ success: true, message: '신규 요원 등록이 완료되었습니다! 로그인을 진행해주세요.' });
        });
    });
});