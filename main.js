const express = require('express');
const Estudante = require('./mongoDB');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.post("/cadEstudantes", async (req, res) => {
    var data = {
        nome: req.body.nome,
        sobrenome: req.body.sobrenome,
        numeroMatricula: req.body.numeroMatricula,
        email: req.body.email,
        senha: req.body.senha
    };
    req.body.numeroMatricula = Number(req.body.numeroMatricula);
    if (!isNaN(req.body.numeroMatricula)) {
        if (
            req.body.numeroMatricula != null &&
            req.body.nome != null &&
            req.body.sobrenome != null &&
            req.body.email != null &&
            req.body.senha != null &&
            req.body.senhaConfirm != null && typeof req.body.numeroMatricula === 'number'
        ) {
            const checkEmail = await Estudante.findOne({ email: req.body.email });
            const checkNumeroMatricula = await Estudante.findOne({ numeroMatricula: req.body.numeroMatricula });
            try {
                if (checkEmail && checkNumeroMatricula) {
                    // se checkEmail e checkNumeroMatricula existirem, significa que o email e o nome já estão sendo usados
                    res.send("Este Email e esta Matricula já estão sendo utilizados");
                    return;
                } else if (checkEmail) {
                    res.send("Este Email já está sendo utilizado");
                    return;
                } else if (checkNumeroMatricula) {
                    res.send("Esta Matricula já está sendo utilizado");
                    return;
                } else if (req.body.senha !== req.body.senhaConfirm) {
                    res.send("As senhas não coincidem");
                    return;
                } else {
                    // se não houver problemas, salve o novo usuário
                    await Estudante.insertMany([data]);
                    res.send("Registrado com sucesso!");
                }
            } catch (error) {
                res.send("Ocorreu um erro: " + error.message);
                return;
            }
        } else {
            res.send("Insira informações válidas");
            return;
        }
    } else {
        res.send("Insira informações válidas");
        return;
    }
});

app.post("/logEstudantes", async (req, res) => {

    if (
        req.body.email != null &&
        req.body.senha != null
    ) {
        // Tente encontrar o usuário pelo nome
        var user = await Estudante.findOne({ email: req.body.email });

        // Se não encontrar o usuário pelo nome, tente encontrar pelo e-mail
        if (!user) {
            req.body.email = Number(req.body.email);
            if (!isNaN(req.body.email)) {
                user = await Estudante.findOne({ numeroMatricula: req.body.email });
            } else {
                res.send("Insira informações válidas");
                return;
            }

        }

        // Se não encontrar o usuário nem pelo nome nem pelo e-mail, as credenciais estão incorretas
        if (!user) {
            res.send("As credências estão incorretas");
            return;
        }

        // Se a senha for correta, o login é efetuado
        if (req.body.senha === user.senha) {
            res.send("logado");
        } else {
            // Senão, a senha está incorreta
            res.send("A senha está incorreta");
        }
    } else {
        res.send("Insira informações válidas");
    }
});

const porta = 3005;
app.listen(porta, () => {
    console.log(`Servidor está captando em http://localhost:${porta}`);
});
