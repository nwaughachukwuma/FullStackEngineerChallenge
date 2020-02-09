import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Op as OpSymbol } from 'sequelize'
import { DBModel } from '../models';
import {RegisterUser, LoginUser} from '../services/auth'

const Employee = DBModel.employees;
const Auth = DBModel.auths
const Op: typeof OpSymbol = DBModel.Sequelize.Op;

/**
 * Register a new user
 */
export const Register = async (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        // Save a new User in the database
        RegisterUser(req.body)
            .then((data: typeof Employee) => {
                res.send({ data, message: 'Admin registration successful' });
            })
            .catch((err: any) => {
                res.status(500).send({
                    error: err.original,
                    message:
                        err.message || "Some error occurred while registering a new admin."
                });
            });
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

/**
 * User login
 */
export const Login = async (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        // Save a new User in the database
        LoginUser(req.body)
            .then(async (data: string) => {
                const userCredentials = await Employee.findOne({
                    where: {
                        email: req.body.email}, 
                    include: Auth
                })
                res.send({ data: userCredentials});
            })
            .catch((err: any) => {
                res.status(500).send({
                    error: err.original,
                    message:
                        err.message || "Some error occurred while attempting to login."
                });
            });
    } catch (e) {
        res.status(500).send({ error: e });
    }
};

/**
 * User logout
 */
export const Logout = async (req: Request, res: Response) => {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        await Auth.update({ accessToken: '' }, {
            where: { employeeId: req.user!.id }
        });
        req.user = null;
        res.send({ message: 'User has logged out' });
        return
    } catch (e) {
        res.status(500).send({ error: e });
    }
};