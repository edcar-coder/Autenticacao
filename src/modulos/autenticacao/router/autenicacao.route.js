const express = require('express');
const router = express.Router()

const AutenticacaoController = require('../controller/autenticacao.controller')

// rota publica de login
router.post('/login', AutenticacaoController.login);

// rota para sair 
router.post('/logout', AutenticacaoController.sair);

// rota usada pelo navegador para atualizar o token 
router.post('/refress-token', AutenticacaoController.refreshToken);

module.exports = router