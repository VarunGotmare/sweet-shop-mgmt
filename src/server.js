require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {  
    res.json({status: "OK"});
});

const PORT = process.env.PORT || 4000; // 3000 for fronedtend ig
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});