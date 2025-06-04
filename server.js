const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; // Define a porta do servidor, 8000 por padrão

// Configuração do Pool de Conexões do MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root', 
    database: process.env.DB_NAME || 'conta_spotify', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testa a conexão com o MySQL
pool.getConnection()
    .then(connection => {
        connection.release(); // Libera a conexão imediatamente após o teste
        console.log('Conexão com o MySQL estabelecida com sucesso!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MySQL:', err.message);
        console.error('Verifique suas credenciais no arquivo .env e se o MySQL está rodando.');
        process.exit(1); // Encerra o processo se não conseguir conectar ao DB
    });

// Middlewares
app.use(cors()); // Habilita CORS para permitir requisições de diferentes origens (frontend)
app.use(express.json()); // Habilita o Express para parsear JSON do corpo das requisições
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public'

// Rota de Cadastro de Usuário
app.post('/api/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Validação básica dos dados recebidos
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos (nome, email, senha) são obrigatórios.' });
    }

    try {
        // Criptografa a senha antes de salvar no banco de dados
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(senha, saltRounds);

        // Insere o novo usuário no banco de dados
        const [result] = await pool.execute(
            'INSERT INTO usuarios (login, email, nome, senha) VALUES (?, ?, ?, ?)',
            [nome, email, nome, password_hash] // 'nome' usado para 'login' e 'nome' na DB
        );

        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
        } else {
            res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }

    } catch (error) {
        // Tratamento de erros específicos do MySQL (e-mail/login duplicado)
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

// Rota de Login de Usuário
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário pelo e-mail no banco de dados
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        const user = rows[0];

        // Verifica se o usuário existe
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Compara a senha fornecida com a senha hash do banco de dados
        const isMatch = await bcrypt.compare(senha, user.senha);

        // Verifica se as senhas coincidem
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Login bem-sucedido: retorna uma mensagem de sucesso (em uma aplicação real, aqui você geraria um token JWT)
        res.status(200).json({ message: 'Login bem-sucedido!', user: { id: user.id, nome: user.nome, email: user.email } });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota de exemplo para buscar usuários (somente para desenvolvimento/depuração)
app.get('/api/users', async (req, res) => {
    try {
        // Seleciona todas as colunas exceto a senha por segurança
        const [rows] = await pool.execute('SELECT id, login, email, nome, created_at FROM usuarios');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar usuários.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
