import { Request, Response } from "express";
import { Todo } from "../models/todo";

export const all = async (req: Request, res: Response) => {
    try {
        const list = await Todo.findAll();
        res.json({ list });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar"})
    }
    
};

export const add = async (req: Request, res: Response) => {
    
    const { title, done} = req.body;

    if(!title) {
        return res.status(400).json({ error: "Preencha o campo title!!"});
    }

    try{
        const existing = await Todo.findOne({ where: {title} });

        if(existing) {
            return res.status(409).json({ error: "Tarefa já existe!!"});
        }
        const newTodo = await Todo.create({
        title: req.body.title,
        done: req.body.done ? true : false
    });

        res.status(201).json({ newTodo })
    }
    catch(error) {
        res.status(500).json({error: "Erro ao criar tarefa!!"})
    }    
};

export const update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {title, done} = req.body;

    try {
        const todo = await Todo.findByPk(id);

        if(!todo) {
            return res.status(404).json({ error: "Preencha o campo title!!"});
        }

        if(todo) {
            todo.title = req.body.title;
        }

        if( typeof done !== "undefined") {
            const normalized = String(done).toLowerCase();

            if(['true', '1'].includes(normalized)) {
                todo.done = true;
            } else if (['false', '0'].includes(normalized)) {
                todo.done = false;
            } else {
                return res.status(400).json({ error: "Valor inválido para 'done'. Use 'true', '1' ou 'false', '0'!!"});
            }
        }
        await todo.save();
        return res.status(200).json({ item: todo });

    } catch(error) {
        console.error("Erro ao atualizar Tarefa", error);
        return res.status(500).json({ error: "Erro interno ao atualizar tarefa!!" })
    }    
};

export const remove = async (req: Request, res: Response) => {
    const id = req.params.id;
    
    try{
        const todo = await Todo.findByPk(id);

        if(!todo) {
            return res.status(404).json({ error: "Item não encontrado!!!"});
        } 
        
        await todo.destroy()
        return res.status(200).json({message: "Tarfa removida com sucesso!!"});
        
    } catch(error) {
        console.error("Erro ao remover tarefa!!", error);
        return res.status(500).json({ error: "Erro interno ao remover tarefa!!"});
    }
    
};