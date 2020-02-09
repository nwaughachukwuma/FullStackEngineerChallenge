import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import {Op as OpSymbol} from 'sequelize'
import { DBModel } from '../models';
import { isEmpty } from 'lodash'


const Reviewer = DBModel.reviewers;
const PerformanceReview = DBModel.performance_reviews
const Op: typeof OpSymbol = DBModel.Sequelize.Op;

// provide feedback for a performance review
export const GiveFeedback = async (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const id = req.params.prId;

    const {
        performanceReviewId,
        peerId,
        feedback
    } = req.body

    // Save Reviewer in the database
    Reviewer.update({feedback: feedback}, {
        where: { 
            id: id,
            performanceReviewId: performanceReviewId, 
            peerId: peerId // to be gotten via authentication token
        }
    }).then((num: number) => {
        if (num == 1) {
            res.send({
                message: "Reviewer feedback updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update reviewer with id=${id}. Maybe Reviewer was not found or req.body is empty!`
            });
        }
    })
    .catch((err: any) => {
        res.status(500).send({
            error: err.original,
            message: "Error updating feedback for reviewer with id=" + id
        });
    });
};

// Retrieve all assigned review for feedbacks.
export const FindAllAssignedReviews = (req: Request, res: Response) => {
    const { performanceReviewId, peerId } = req.query;
    
    if (!isEmpty(req.query)) {
        if (!performanceReviewId && !peerId) {
            res.status(500).send({error: 
                `Use the correct query paramater:
                'peerId', 'performanceReviewId' or none`
            });
            return;
        }
    }
    
    let condition = Object.assign(
        {}, 
        peerId ? { peerId: peerId } : null, 
        performanceReviewId ? { performanceReviewId: performanceReviewId } : null
    );

    Reviewer.findAll({ where: condition, include: PerformanceReview })
        .then((data: any) => {
            return res.send({ data });
        })
        .catch((err: any) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving reviewers."
            });
        });
};

/**
 *  get all assigned and pending peer reviews
 * i.e. where feedback is blank
 */ 
export const FindAllAssignedPendingReviews = (req: Request, res: Response) => {
    const {peerId} = req.params;

    const condition = Object.assign(
        {},
        {feedback: ""},
        peerId? {peerId: peerId}: null
    )

    Reviewer.findAll({where: condition, include: PerformanceReview})
        .then((data: any) => {
            res.send({data});
        })
        .catch((err: any) => {
            res.status(500).send({
                message: "Error retrieving pending peer review"
            });
        });
};