import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import {Op as OpSymbol} from 'sequelize'
import { DBModel } from '../models';
import {isEmpty} from 'lodash'
import {sequelize} from '../models'


const PerformanceReview = DBModel.performance_reviews;
const Feedback = DBModel.feedbacks
const Op: typeof OpSymbol = DBModel.Sequelize.Op;

// Create and Save a new Performance review
export const CreatePerformanceReview = (req: Request, res: Response) => {

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
        evaluation,
        remark,
        is_reviewed
    } = req.body

    // Create a Performance review
    const performance_review = {
        employeeId,
        month,
        year,
        evaluation,
        remark,
        is_reviewed: is_reviewed || false
    };

    // Save Tutorial in the database
    PerformanceReview.create(performance_review)
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
export const FindAllPerformanceReviews = (req: Request, res: Response) => {
    const {month, year, is_reviewed} = req.query;
    
    let condition = Object.assign(
        {}, 
        is_reviewed ? { is_reviewed: is_reviewed } : null, 
        month ? { month: { [Op.like]: `%${month}%` } } : null,
        year ? { year: { [Op.like]: `%${year}%` } } : null,
    );

    PerformanceReview.findAll({ where: condition })
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
export const FindOnePerformanceReview = (req: Request, res: Response) => {
    const id = req.params.id;

    PerformanceReview.findByPk(id)
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

// Retrieve all Performance reviews from the database.
export const FindAllPerformanceReviewWithoutFeedback = async (req: Request, res: Response) => {
    const {month, year, is_reviewed} = req.query;
    
    let condition = Object.assign(
        {}, 
        is_reviewed ? { is_reviewed: is_reviewed } : null, 
        month ? { month: { [Op.like]: `%${month}%` } } : null,
        year ? { year: { [Op.like]: `%${year}%` } } : null,
    );

    // PerformanceReview.findAll({
    //     attributes: {
    //         include: [
    //             [
    //                 // Note the wrapping parentheses in the call below!
    //                 sequelize.literal(`(
    //                     SELECT COUNT(*)
    //                     FROM feedbacks AS feedback
    //                     WHERE
    //                         feedback.performance_reviewId = performance_review.id
    //                         AND
    //                         performance_review.status = "not_done"
    //                 )`),
    //                 'PerformanceReviewWithoutFeedback'
    //             ]
    //         ]
    //     },
    //     // where: {perfReviewWithoutFeedback: {[Op.gt]: 0}}
    // }).then((data: any) => {
    //     return res.send({data})
    // }).catch((err: any) => {
    //         res.status(500).send({
    //             error: err
    //         })
    //     }
    // )

    // const feedy = Feedback.findOne();
    // console.log((feedy.getPerfReview()).toJSON());

    const donePerfReviews = await PerformanceReview.findAll({where: {status: 'not_done'}, include: Feedback})

    // const temp = await donePerfReviews.getFeedback();
    return res.send({data: donePerfReviews});

    // PerformanceReview.findAll({ where: condition, include: Feedback })
    //     .then((data: any) => {
    //         return res.send({ data });
    //     })
    //     .catch((err: any) => {
    //         res.status(500).send({
    //             error: err.original,
    //             message:
    //                 err.message || "Some error occurred while retrieving performance reviews."
    //         });
    //     });
};
