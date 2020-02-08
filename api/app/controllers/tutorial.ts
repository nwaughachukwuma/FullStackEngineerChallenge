import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { DBModel } from '../models';


const Tutorial = DBModel.tutorials;
const Op = DBModel.Sequelize.Op;

// Create and Save a new Tutorial
export const CreateTutorial = (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const {
        author,
        title,
        description,
        published
    } = req.body

    // Create a Tutorial
    const tutorial = {
        author: author,
        title: title,
        description: description,
        published: published ? published : false
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorials from the database.
export const FindAllTutorial = (req: Request, res: Response) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Tutorial.findAll({ where: condition })
        .then((data: any) => {
            return res.send({ data });
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single Tutorial with an id
export const FindOneTutorial = (req: Request, res: Response) => {
    const id = req.params.id;

    Tutorial.findByPk(id)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: any) => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
export const UpdateTutorial = (req: Request, res: Response) => {

    // Validate params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const id = req.params.id;

    Tutorial.update(req.body, {
        where: { id: id }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
                });
            }
        })
        .catch((err: any) => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
export const DeleteTutorial = (req: Request, res: Response) => {
    const id = req.params.id;

    Tutorial.destroy({
        where: { id: id }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch((err: any) => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
export const DeleteAllTutorial = (req: Request, res: Response) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// Find all published Tutorials
export const FindAllPublishedTutorial = (req: Request, res: Response) => {
    Tutorial.findAll({ where: { published: true } })
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        });
};