import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import {Op as OpSymbol} from 'sequelize'
import { DBModel } from '../models';


const Feedback = DBModel.feedbacks;
const Op: typeof OpSymbol = DBModel.Sequelize.Op;

// Create and Save a new Feedback
export const CreateFeedback = (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const {
        performance_reviewId,
        peerId,
        feedback : employee_feedback
    } = req.body

    // Create a Performance review
    const feedback = {
        performance_reviewId,
        peerId,
        feedback: employee_feedback
    };

    // Save Feedback in the database
    Feedback.create(feedback)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err,
                message:
                    err.message || "Some error occurred while creating the performance review."
            });
        });
};

// Retrieve all performance review feedbacks.
export const FindAllFeedbacks = (req: Request, res: Response) => {
    const {performance_reviewId, peerId} = req.query;
    
    let condition = Object.assign(
        {}, 
        peerId ? { peerId: { [Op.like]: `%${peerId}%` } } : null, 
        performance_reviewId ? { performance_reviewId: { [Op.like]: `%${performance_reviewId}%` } } : null
    );

    Feedback.findAll({ where: condition })
        .then((data: any) => {
            return res.send({ data });
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving feedbacks."
            });
        });
};

// Find a single Feedback with an id
export const FindOneFeedback = (req: Request, res: Response) => {
    const id = req.params.id;

    Feedback.findByPk(id)
        .then((data: any) => {
            res.send({data});
        })
        .catch((err: any) => {
            res.status(500).send({
                message: "Error retrieving Feedback with id=" + id
            });
        });
};
