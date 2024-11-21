// routes/signIn.js
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Rota para renderizar a página de login
router.get('/', (req, res) => {
  res.render('signIn');
});

// Rota para realizar o login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca usuário por email
    const user = await User.findByEmail(email); // Removido req.app.locals.db
    console.log('Usuário encontrado:', user);
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Compara a senha usando bcrypt
    const match = await bcrypt.compare(password, user.password);
    console.log('Resultado da comparação de senha:', match)
    if (!match) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Criação do token JWT
    const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

    // Enviar o token e uma resposta de sucesso
    // Enviar a resposta de sucesso com o token
    return res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token  // Você pode enviar o token se precisar armazenar no frontend
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login', error });
  }
});

export default router;
