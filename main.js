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
        senha: req.body.senha
    };
    req.body.numeroMatricula = Number(req.body.numeroMatricula);
        if (
            req.body.numeroMatricula != null &&
            req.body.nome != null &&
            req.body.sobrenome != null &&
            req.body.senha != null &&
            req.body.senhaConfirm != null && typeof req.body.numeroMatricula === 'number'
        ) {
            const checkNumeroMatricula = await Estudante.findOne({ numeroMatricula: req.body.numeroMatricula });
            try {
                if (checkNumeroMatricula) {
                    // se checkNumeroMatricula existir, significa que a numeroMatricula já estão sendo usados
                    res.send("Esta Matricula já está sendo utilizada");
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

});

app.post("/logEstudantes", async (req, res) => {

    if (
        req.body.numeroMatricula != null &&
        req.body.senha != null
    ) {
        // Tente encontrar o usuário pelo nome
        var user = await Estudante.findOne({ numeroMatricula: req.body.numeroMatricula });

        if (!user) {
            res.send("Insira informações válidas");
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
app.get('/estudante/:matricula', (req, res) => {
  
    Estudante.findOne({ numeroMatricula: req.params.matricula })
      .then(estudante => {
        if (estudante) {
          const nome = estudante.nome;
          const saldo = estudante.saldo;
          res.status(200).json({ nome, saldo });
        } else {
          res.status(404).json({ mensagem: `Estudante com matrícula ${req.params.matricula} não encontrado.` });
        }
      })
      .catch(error => {
        res.status(500).json({ mensagem: `Erro ao buscar estudante com matrícula ${req.params.matricula}: ${error}` });
      });
  });
  

const porta = 3005;
app.listen(porta, () => {
    console.log(`Servidor está captando em http://localhost:${porta}`);
});
