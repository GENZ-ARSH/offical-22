const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS for local and deployed frontend
const allowedOrigins = [
    'http://localhost:4000',
    'https://genzz-library.netlify.app' // Update to your Netlify URL
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.options('*', cors());

app.use(express.json());

// In-memory book storage
let books = [
    {
        id: 1,
        title: 'Concept of Physics - Part 1 & 2 By H.C. Verma (Set of 2 books)2025-26',
        class: 'all',
        exam: 'all',
        image_url: 'https://booksfy.in/cdn/shop/files/81XNZcwmvQL._SY466_720x.jpg?v=1744208066',
        pdf_url: 'https://drive.google.com/drive/folders/19Qqr5Q-QIpOgiJlAzvfL3dpJ7gy2SWZc',
        clicks: 0
    },
    {
        id: 2,
        title: 'R.D. Sharma Mathematics For Class 12 with MCQs in Mathematics CBSE Exam',
        class: '12th',
        exam: 'all',
        image_url: 'https://m.media-amazon.com/images/I/71S2iO-j4WL._SL1360_.jpg',
        pdf_url: 'https://drive.google.com/drive/folders/1b2c3d4e5f6g7h8i9j0k',
        clicks: 0
    },
    {
        id: 3,
        title: 'Lakshya For JEE Main & Advanced Class 12 Mathematics Modules with Solutions',
        class: '12th',
        exam: 'JEE',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/94e47ae5-37e2-4e11-989a-d8dea1bf8881.png',
        pdf_url: 'https://drive.google.com/drive/folders/1g0HbYev2fHuHed56xFWuxn6nri-jQcH-',
        clicks: 0
    },
    {
        id: 4,
        title: 'Lakshya For JEE Main & Advanced Class 12 Physics Modules with Solutions',
        class: '12th',
        exam: 'JEE',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/94e47ae5-37e2-4e11-989a-d8dea1bf8881.png',
        pdf_url: 'https://drive.google.com/drive/folders/1tHywg5e8KU-gqaRqtfWC5041kso1PPE5',
        clicks: 0
    },
    {
        id: 5,
        title: 'Arjuna for NEET Class 11th Zoology Modules with Solutions',
        class: '11th',
        exam: 'NEET',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/a946956d-c803-48e4-8932-40dd1d30ee3e.png',
        pdf_url: 'https://drive.google.com/drive/folders/1fXe8T1Tvhef9EHzGu75qc4Ezjw4REKef',
        clicks: 0
    },
    {
        id: 6,
        title: 'Arjuna for NEET Class 11th Botany Modules with Solutions',
        class: '11th',
        exam: 'NEET',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/a946956d-c803-48e4-8932-40dd1d30ee3e.png',
        pdf_url: 'https://drive.google.com/drive/folders/1N18tjDboqiWy__W3yha1wPCw1VgtTTyO',
        clicks: 0
    },
    {
        id: 7,
        title: 'Arjuna for NEET Class 11th Chemistry Modules with Solutions',
        class: '11th',
        exam: 'NEET',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/a946956d-c803-48e4-8932-40dd1d30ee3e.png',
        pdf_url: 'https://drive.google.com/drive/folders/1oAsZuEO5khBNvs-gAaPTyh1IPWbyLxxx',
        clicks: 0
    },
    {
        id: 8,
        title: 'Arjuna for NEET Class 11th Physics Modules with Solutions',
        class: '11th',
        exam: 'NEET',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/a946956d-c803-48e4-8932-40dd1d30ee3e.png',
        pdf_url: 'https://drive.google.com/drive/folders/1Y9xMj21xEf3lIXiWPn8l1Om5TdP9NmEU?usp=sharing',
        clicks: 0
    },
    {
        id: 9,
        title: 'PW Arjuna For JEE Main & Advanced Class 11 Chemistry Modules with Solutions Combo',
        class: '11th',
        exam: 'JEE',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/42178cbc-1934-4b5e-a839-cd7011a3e2df.png',
        pdf_url: 'https://drive.google.com/drive/folders/1cYHE8zZSiXE8oSX1cbcUCZBYFdyIn-ux?usp=sharing',
        clicks: 0
    },
    {
        id: 10,
        title: 'PW Arjuna For JEE Main & Advanced Class 11 Physics Modules with Solutions Combo',
        class: '11th',
        exam: 'JEE',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/8831b5ff-8489-4701-a3a1-6da10eba9c92.png',
        pdf_url: 'https://drive.google.com/drive/folders/1wNVqa4LEWu8_whknsX6-mEsXxPjiE40N?usp=sharing',
        clicks: 0
    },
    {
        id: 11,
        title: 'PW Arjuna For JEE Main & Advanced Class 11 Mathematics Modules with Solutions Combo',
        class: '11th',
        exam: 'JEE',
        image_url: 'https://d2bps9p1kiy4ka.cloudfront.net/5eb393ee95fab7468a79d189/8691f6ca-2ea2-4cbf-8b2e-9c82fc53bf4a.png',
        pdf_url: 'https://drive.google.com/drive/folders/16mNjp9kALYgtj85k2sehRTjB8TTr1AQn?usp=sharing',
        clicks: 0
    },
    {
        id: 12,
        title: 'Arihant iSucceed Hindi-B — Sample Papers Latest (2024-25) edition',
        class: '10th',
        exam: 'Board',
        image_url: 'https://m.media-amazon.com/images/I/71G1tHgBECL._SY385_.jpg',
        pdf_url: 'https://drive.google.com/file/d/1JT73_l4wsRjJ82mOsTlcl1ZJwKNJBX-a/view?usp=drive_link',
        clicks: 0
    },
    {
        id: 13,
        title: "Kriti Sharma 1'o Clack REVISION BOOK - MATHS",
        class: '10th',
        exam: 'Board',
        image_url: 'https://m.media-amazon.com/images/I/51HdQ-2w9GL._SX342_SY445_.jpg',
        pdf_url: 'https://drive.google.com/file/d/1ArUJOHb-QMCfczunvxYjdGMJe0rJZzHo/view?usp=drive_link',
        clicks: 0
    },
    {
        id: 14,
        title: "Kriti Sharma 1'o clock Revision Book - SST",
        class: '10th',
        exam: 'Board',
        image_url: 'https://imgv2-2-f.scribdassets.com/img/document/808355992/298x396/5debde49a3/1743706895',
        pdf_url: 'https://drive.google.com/file/d/1Mit-R7-lK-te5y54CPdvCawxM-XYxdwT/view?usp=drive_link',
        clicks: 0
    }
];

// Get all books
app.get('/api/books', (req, res) => {
    try {
        res.json(books);
    } catch (error) {
        console.error('Fetch books error:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Add a book
app.post('/api/books', (req, res) => {
    try {
        const { title, class: bookClass, exam, image_url, pdf_url } = req.body;
        if (!title || !bookClass || !exam || !image_url || !pdf_url) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        const book = {
            id: books.length + 1,
            title,
            class: bookClass,
            exam,
            image_url,
            pdf_url,
            clicks: 0
        };
        books.push(book);
        res.json({ success: true });
    } catch (error) {
        console.error('Book add error:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Admin login
app.post('/api/admin-login', (req, res) => {
    try {
        const { password } = req.body;
        if (password === 'GENZISKING') {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
