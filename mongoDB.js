const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://carloslosada:V7vqtmobeSkYe6zJ@cluster0.y7sw3lq.mongodb.net/Cadastro-Projeto-Aguia")
    .then(() => {
        console.log("mongodb conectado");
    })
    .catch(() => {
        console.log("falhou amigo");
    })
const dadosEstudante = new Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    numeroMatricula: {
        type: Number,
        unique: true,
        required: true
    },
    saldo: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    senha: {
        type: String,
        requited: true
    }
});

const Estudante = mongoose.model('Estudante', dadosEstudante);

module.exports = Estudante;
