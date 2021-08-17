const tarefasJson = require("../models/tarefas.json");
const fs = require("fs");

const getAll = (req, res) => {
    res.status(200).send(tarefasJson);
};

const getById = (req, res) => {
    const idRequirido = req.params.id
    const tarefaFiltrada = tarefasJson.find(tarefa => tarefa.id == idRequirido)

    res.status(200).send(tarefaFiltrada)
}

const createTask = (req, res) => {
    const descricaoRequirida = req.body.descricao
    const nomeColaboradorRequirido = req.body.nomeColaborador

    const novaTarefa = {
        id: Math.random().toString(32).substr(2, 9),
        dataInclusao: new Date(),
        concluido: false,
        descricao: descricaoRequirida,
        nomeColaborador: nomeColaboradorRequirido
    }

    tarefasJson.push(novaTarefa)

    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefasJson), 'utf8', function(err){
        if(err) {
            return res.status(424).send({message: err})
        }
    })

    res.status(200).send(novaTarefa)

}

const deleteTask = (req, res) => {
    const idRequirido = req.params.id
    const tarefaFiltrada = tarefasJson.find(tarefa => tarefa.id == idRequirido)

    const indice = tarefasJson.indexOf(tarefaFiltrada)
    tarefasJson.splice(indice, 1)

    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefasJson), 'utf8', function(err){
        if(err) {
            return res.status(424).send({message: err})
        }
    })

    res.status(200).json([{
        "mensagem": "Tarefa deletada!",
        tarefasJson
    }])

}

const replaceTask  = (req,res) =>{
    const idReq = req.params.id;
    const postBody = req.body;

    const filteredPost = tarefasJson.find(tarefa => tarefa.id == idReq)

    let updatedTask  = {
        "id": postBody.id,
        "dataInclusao": postBody.dataInclusao,
        "concluido": postBody.concluido,
        "descricao": postBody.descricao,
        "nomeColaborador": postBody.nomeColaborador
    }

    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefasJson), 'utf8', function(err){
        if(err) {
            return res.status(424).send({message: err})
        }
    })

    res.status(200).send(updatedTask)

    res.status(200).send({
        "mensagem": "Post substituído com sucesso",
        updatedTask
    })

}

const update = (req, res) =>{

    let reqId = req.params.id;
    let updatedTask = req.body;
    let filteredTask = tarefasJson.find(task=> task.id == reqId);

    let keyList = Object.keys(updatedTask);
    keyList.forEach((key)=>{
        filteredTask[key] = updatedTask[key];
    });
    res.status(200).send({"mensagem": "Tarefa atualizada!", filteredTask});
    
    fs.writeFile("./src/models/tarefas.json", JSON.stringify(tarefasJson), 'utf8', function(err){
        if(err) {
            return res.status(424).send({message: err})
        }
    })

    res.status(200).send(updatedTask)
}


module.exports = {
    getAll,
    getById,
    createTask,
    deleteTask,
    replaceTask,
    update
}