import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import {Op as OpSymbol} from 'sequelize'
import { DBModel } from '../models';


const Employee = DBModel.employees;
const Op: typeof OpSymbol = DBModel.Sequelize.Op;

export async function CreateEmployee(req: Request, res: Response) {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    // Create new user
    const {
        name,
        email,
        phone,
        gender,
        role,
        rank,
        job_definition
    } = req.body;

    const user_data = {
        name,
        email,
        phone,
        gender,
        role,
        rank,
        job_definition: job_definition? job_definition: null
    }

    // Save a new User in the database
    Employee.create(user_data)
        .then((data: typeof Employee) => {
            res.send({data, message: 'New user created'});
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message:
                    err.message || "Some error occurred while creating a new employee."
            });
        });
}

export async function FetchOneEmployee(req: Request, res: Response) {

    const id = req.params.id;

    Employee.findByPk(id)
        .then((data: any) => {
            res.send({data});
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message: "Error retrieving employee with id=" + id
            });
        });
}

export async function FetchAllEmployees(req: Request, res: Response) {

    const {name, email} = req.query;

    let condition = Object.assign(
        {}, 
        name ? { name: { [Op.like]: `%${name}%` } } : null, 
        email ? { email: { [Op.like]: `%${email}%` } } : null
    );

    Employee.findAll({ where: condition })
        .then((data: any) => {
            return res.send({ data });
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message:
                    err.message || "Some error occurred while retrieving employees."
            });
        });
}


export async function MeController(_req: Request, res: Response) {

    return res.status(200).send({
        success: true,
        data: {
            name: 'Chukwuma Nwaugha',
            email: 'c.nwaugha@gmail.com',
            github: 'https://github.com/nwaughachukwuma'
        }
    })
}