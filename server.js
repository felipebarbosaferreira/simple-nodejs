const express = require('express');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");

// configurar para ler json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serving static files
app.use(express.static(__dirname + '/frontend/js'));
app.use(express.static(__dirname + '/frontend/css'));
app.use(express.static(__dirname + '/frontend/images'));

const tarefas = [];

/**
 * Rest`s existentes
 * GET
 * http://localhost:3000/
 * http://localhost:3000/tarefas
 * http://localhost:3000/tarefa/01e73daa-e7d6-485f-8331-b3fa87ae1baa
 * 
 * POST
 * http://localhost:3000/tarefa 
 * 
 * DELETE
 * http://localhost:3000/tarefa/01e73daa-e7d6-485f-8331-b3fa87ae1baa
 * 
 * PUT
 * http://localhost:3000/tarefa/01e73daa-e7d6-485f-8331-b3fa87ae1baa
*/

// retornar o html da pagina inicial
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.get('/tarefas', (req, resp) => {
    console.log('GET listar tarefas');
    resp.send(tarefas);
});

app.get('/tarefa/:id', (req, resp) => {
    console.log('GET pegar uma tarefa com o id: ', req.param.id);
    tarefas.forEach(item => {
        if (item.idV4 == req.param.id) {
            resp.send(item);
            return;
        }
    });
    resp.status(404).send();
});

app.post('/tarefa', (req, resp) => {
    console.log('POST incluir tarefa');
    console.log(req.body);
    let tarefa = {
        id: Math.random().toString().replace('0.', ''),
        uuidv4: uuidv4(),
        tarefaTerminada: false
    };
    Object.assign(tarefa, req.body);
    tarefas.push(tarefa);

    /* status 201 - recurso criado. Se nao vai devolver nada o melhor e o 204, pois 
       significa processei, deu certo e nao vou te devolver nada, flw.

       todos os codigo da faixa 
          200 deu certo
          300 redirecionamento o recurso esta em outro lugar
          400 problema no lado do cliente. exemplo 401 nao autorizado
          500 lado do servido deu merda
    */
    resp.status(201).send();
});

app.delete('/tarefa/:taskId', (req, resp) => {
    console.log('DELETE tarefa com o id: ', req.params.taskId);
    let index = 0;
    tarefas.forEach(item => {
        if (item.uuidv4 == req.params.taskId) {
            tarefas.splice(index, 1);
            return;
        }
        index++;
    });
    resp.status(200).send();
});

app.put('/tarefa/:taskId', (req, resp) => {
    console.log("PUT atualizar tarefa com o id: ", req.params.taskId);
    const { body } = req;
    const task = tarefas.find(t => t.uuidv4 == req.params.taskId);

    if (task) {
        task.id = body.id;
        task.uuidv4 = body.uuidv4;
        task.terminada = body.terminada;
        task.responsavel = body.responsavel;
        task.nome = body.nome;
        task.descricao = body.descricao;
        task.prioritaria = body.prioritaria;
        resp.status(200).send();
    } else {
        resp.status(404).send();
    }
});

app.listen(3000, () => {
    console.log('servidor is ON port 3000');
});