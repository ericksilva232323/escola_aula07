const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const read = async (req, res) => {
    const professores = await prisma.professor.findMany();
    return res.json(professores);
}

const login = async (req, res) => {
    console.log(req.body);
    const { email, senha } = req.body;

    // Validate input
    if ( ! email || ! senha ) {
        return res.status(400).json({ erro: "Requisição inválida: {email, senha} são obrigatórios" });
    }

    try {
        const professor = await prisma.professor.findUnique({
            where: { email: email },
            select: {
                id: true,
                nome: true,
                email: true,
                senha: true 
            }
        });
        
        if (professor) {
            if (professor.senha === senha) {
                return res.json(professor);
            } else {
                return res.status(401).json({ erro: "Senha incorreta" });
            }
        } else {
            return res.status(404).json({ erro: "Professor não encontrado" }).end();
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};

module.exports = {
        read,
        login
    }