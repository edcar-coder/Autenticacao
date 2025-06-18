const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../../admin/models/admin.model')

// Definindo variaveis de ambiente para TEMPO_ACESS_TOKEN e TEMPO_REFRESH_TOKEN
const tempo_acess_token = process.env.TEMPO_ACESS_TOKEN;
const tempo_refresh_token = process.env.TEMPO_REFRESH_TOKEN;

class AutenticacaoController{
    // gerar o token 
    static gerarTokenAcesso(dadosUsuario){
        return jwt.sign(dadosUsuario, process.env.SECRET_KEY, {
            expiresIn: tempo_acess_token
        });
    };
    // gerar o refresh token
    static gerarRefressToken(dadosUsuario){
        return jwt.sign(dadosUsuario, process.env.SECRET_KEY, {
            expiresIn: tempo_refresh_token
        });
    };
    // processo de login
    static async login(req, res){
        const { email, senha } = req.body;
        if(!email, !senha){
            return res.status(400).json({msg: 'É necessario informar e-mail e senha para login'})
        }
        const usuario = await Admin.findOne({
            where: {email}
        });
        
        if(!usuario){
            return res.status(401).json({msg: 'Usuario não encontrado!'})
        };
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if(!senhaCorreta){
            return res.status(401).json({msg: 'E-mail ou senha incorreta!'})
        };
        const dadosUsuario = {
            matricula: usuario.matricula,
            nome: usuario.nome,
            papel: 'admin'
        }
        // gerando os tokens 
        const tokenAcesso = AutenticacaoController.gerarTokenAcesso(dadosUsuario);
        const refreshToken = AutenticacaoController.gerarRefressToken(dadosUsuario);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV,
            sameStrict: 'strict',
            maxAge: 7 * 24 * 60 * 1000, // 7dias
        })

        res.status(200).json({
            tokenAcesso,
            nome: usuario.nome,
            papel: 'admin'
        })
    }

    // função para renovar o refresh token
    static refreshToken(req, res){
        const { refreshToken } = req.cookies
        if(!refreshToken){
            return res.status(403).json({msg: 'Refresh token invalido!'})
        }
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET,
            (erro, usuario) => {
                if(erro){
                    return res.status(403).json({msg: 'Refresh invalido!'})
                }
                const dadosUsuario = {
                    matricula: usuario.matricula,
                    nome: usuario.nome,
                    papel: 'admin'
                }
                // gerando o novo token
                const novoTokenAcesso = this.gerarTokenAcesso(dadosUsuario)
                // atualizando o token antigo para o novo
                res.status(200).json({tokenAcesso:novoTokenAcesso})
            }
        )
    }
    // sair do sistema
    static logout(req, res){
        res.clearCookies('refreshToken', {
            httpOnly: false,
            secure: process.env.NODE_ENV,
            sameStrict: 'strict',
        });
        res.status(200).json({msg: 'Logout realizado com sucesso!'})
    }
}

module.exports = {
    login: AutenticacaoController.login,
    refreshToken: AutenticacaoController.refreshToken,
    logout: AutenticacaoController.logout
}