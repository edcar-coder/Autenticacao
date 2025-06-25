const express = require('express');
const AlunoController = require('../controllers/alunoController');
const router = express.Router();

// rota de cadastro
router.post('/cadastrar', AlunoController.cadastrar)

module.exports = router;