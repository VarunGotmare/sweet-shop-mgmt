require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {  
    try{
        const users = await prisma.user.findMany();
        res.json({ status: 'ok', users });
    }catch(error){
        res.status(500).json({ status: 'error', message: error.message });
    }
    
});

const PORT = process.env.PORT || 4000; // 3000 for fronedtend ig
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});