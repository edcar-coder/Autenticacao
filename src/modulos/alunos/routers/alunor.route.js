const express = require('express');
const AlunoController = require('../controllers/alunoController');
const AutenticacaoMiddleware = require('../middleware/aluno.middleware');
const router = express.Router();

// rota de cadastro
router.post('/cadastrar', AlunoController.cadastrar)

// rota de cadastro
router.post('/cadastrar', AlunoController.cadastrar)

// rota de perfil
router.get('/perfil', AutenticacaoMiddleware.autenticarToken, AlunoController.perfil)

module.exports = router;