import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { DBModel } from '../models';
const Feedback = DBModel.feedbacks;
// const Op = DBModel.Sequelize.Op;

// Create and Save a new Tutorial
export const CreateFeedback = (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const {
        perfreviewId,
        peerId,
        feedback : employee_feedback
    } = req.body

    // Create a Performance review
    const feedback = {
        perfreviewId: perfreviewId,
        peerId: peerId,
        feedback: employee_feedback
    };

    // Save Tutorial in the database
    Feedback.create(feedback)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the performance review."
            });
        });
};

// Retrieve all Tutorials from the database.
// export const FindAllTutorial = (req: Request, res: Response) => {
//     const title = req.query.title;
//     var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

//     Tutorial.findAll({ where: condition })
//         .then((data: any) => {
//             return res.send({ data });
//         })
//         .catch((err: any) => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving tutorials."
//             });
//         });
// };

// // Find a single Tutorial with an id
// export const FindOneTutorial = (req: Request, res: Response) => {
//     const id = req.params.id;

//     Tutorial.findByPk(id)
//         .then((data: any) => {
//             res.send(data);
//         })
//         .catch((err: any) => {
//             res.status(500).send({
//                 message: "Error retrieving Tutorial with id=" + id
//             });
//         });
// };