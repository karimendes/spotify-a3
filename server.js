const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; 


const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'conta_spotify',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


pool.getConnection()
    .then(connection => {
        connection.release(); 
        console.log('Conexão com o MySQL estabelecida com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MySQL:', err.message);
        console.error('Verifique suas credenciais no arquivo .env e se o MySQL está rodando.');
        process.exit(1); 
    });


app.use(cors()); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 


app.post('/api/register', async (req, res) => {
    const { nome, email, senha } = req.body;

   
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    try {
        
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(senha, saltRounds);

       
        const [result] = await pool.execute(
            'INSERT INTO usuarios (login, email, nome, senha) VALUES (?, ?, ?, ?)',
            [nome, email, nome, password_hash] 
        );

       if (result.affectedRows === 1) {
    
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
    console.log('Usuário cadastrado com sucesso! ID:', result.insertId); // Log no servidor
}

    } catch (error) {
       
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('login') || error.sqlMessage.includes('nome')) {
                return res.status(409).json({ message: 'Nome de usuário ou login já existe.' });
            }
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json({ message: 'E-mail já cadastrado.' });
            }
        }
        console.error('Erro no cadastro:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        const user = rows[0];

       
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        
        const isMatch = await bcrypt.compare(senha, user.senha);

        
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

       
        
        res.status(200).json({ user: { id: user.id, nome: user.nome, email: user.email } });
        console.log('Login bem-sucedido! Usuário:', user.email); 

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        
        const [rows] = await pool.execute('SELECT id, login, email, nome, created_at FROM usuarios');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar usuários.' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
