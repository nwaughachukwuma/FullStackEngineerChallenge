import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import {Op as OpSymbol} from 'sequelize'
import { DBModel } from '../models';


const PerfReview = DBModel.perfreviews;
const Op: typeof OpSymbol = DBModel.Sequelize.Op;

// Create and Save a new Performance review
export const CreatePerfReview = (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const {
        employeeId,
        month,
        year,
        score,
        remark,
        status
    } = req.body

    // Create a Performance review
    const perfreview = {
        employeeId: employeeId,
        month: month,
        year: year,
        score: score,
        remark: remark,
        status: status ? 'done' : 'not_done'
    };

    // Save Tutorial in the database
    PerfReview.create(perfreview)
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message:
                    err.message || "Some error occurred while creating the performance review."
            });
        });
};

// Retrieve all Performance reviews from the database.
export const FindAllPerfReview = (req: Request, res: Response) => {
    const {month, year, status} = req.query;
    
    let condition = Object.assign(
        {}, 
        status ? { status: { [Op.like]: `%${status}%` } } : null, 
        month ? { month: { [Op.like]: `%${month}%` } } : null,
        year ? { year: { [Op.like]: `%${year}%` } } : null,
    );

    PerfReview.findAll({ where: condition })
        .then((data: any) => {
            return res.send({ data });
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message:
                    err.message || "Some error occurred while retrieving performance reviews."
            });
        });
};

// Find single performance with :id
export const FindOnePerfReview = (req: Request, res: Response) => {
    const id = req.params.id;

    PerfReview.findByPk(id)
        .then((data: any) => {
            res.send({data});
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message: "Error retrieving performance review with id=" + id
            });
        });
};
