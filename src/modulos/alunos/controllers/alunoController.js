const Aluno = require("../models/aluno.model");

class AlunoController {
  static async cadastrar(req, res) {
    try {
      const { matricula, nome, email, senha } = req.body;
      if (!matricula || !nome || !email || !senha) {
        return res
          .status(400)
          .json({ msg: "Todos os campos devem serem preenchidos!" });
      }
      const aluno = await Aluno.create({ matricula, nome, email, senha });
      res.status(200).json({ msg: `Aluno ${aluno.nome} criado com sucesso` });
    } catch (error) {
        res.status(500).json({msg: 'Erro do servidor. Tente novamente mais tarde!'})
    }
  }
  static async perfil(req, res) {
    try {
      const aluno = await Aluno.findAll();
      if (!aluno) {
        return res.status(401).json({ msg: "Não existe aluno cadastrado!" });
      }
      res.status(200).json(aluno);
    } catch (error) {
        res.status(500).json({msg: 'Erro do servidor. Tente novamente mais tarde!'})
    }
  }
  static async login() {
    try {
        
    } catch (error) {
        
    }
  }
  static async sair() {
    try {
        
    } catch (error) {
        
    }
  }
}
