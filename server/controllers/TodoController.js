const { Todo } = require("../models");

class TodoController {
    static add(req, res, next) {
        const obj = {
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date,
            UserId: req.loggedInUser.id
        }
        Todo.create(obj)
            .then((data) => {
                res.status(201).json(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    static read(req, res, next) {
        Todo.findAll({
            order: [["due_date", "ASC"]],
            where: {
                UserId: req.loggedInUser.id
            }
        })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
               next(err);
            });
    }

    static findByPk(req, res, next) {
        const id = Number(req.params.id);
        Todo.findByPk(id)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    static async put(req, res, next) {
        try {
            const id = Number(req.params.id);
            const obj = {
                title: req.body.title,
                description: req.body.description,
                status: req.body.status,
                due_date: req.body.due_date,
                UserId: req.loggedInUser.id
            }
            const result = await Todo.update(obj, {
                where: {
                    id
                },
                returning: true
            });
            res.status(200).json(result[1][0]);
        } catch (err) {
            next(err);
        }
    }

    static async patch(req, res, next) {
        try {
            const id = Number(req.params.id);
            const obj = {
                status: req.body.status,
            }
            const result = await Todo.update(obj, {
                where: {
                    id
                },
                returning: true
            });
            res.status(200).json(result[1][0]);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            console.log(id, "delete")
            const result = await Todo.destroy({
                where: {
                    id
                }
            });
            res.status(200).json({ message: "The task has been successfully deleted." });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = TodoController;