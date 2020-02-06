import { Request, Response } from 'express'
import { validationResult } from 'express-validator'


export async function CreateUserController(req: Request, res: Response) {

    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    return res.status(200).send({
        success: true,
        data: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            country: req.body.country,
            github: 'https://github.com/nwaughachukwuma'
        }
    })
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