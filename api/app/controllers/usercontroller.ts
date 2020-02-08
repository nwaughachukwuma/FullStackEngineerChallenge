import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { DBModel } from '../models';
const User = DBModel.users;


export async function CreateUserController(req: Request, res: Response) {

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
        level,
        job_definition
    } = req.body;

    const user_data = {
        name: name,
        email: email,
        phone: phone,
        gender: gender,
        role: role,
        level: level,
        job_definition: job_definition? job_definition: null
    }

    // Save a new User in the database
    User.create(user_data)
        .then((data: typeof User) => {
            const userData = {...data}
            // omit the hashed password from the response
            delete userData.dataValues.password
            res.send({data: userData.dataValues, message: 'New user created'});
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err,
                message:
                    err.message || "Some error occurred while creating a new employee."
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