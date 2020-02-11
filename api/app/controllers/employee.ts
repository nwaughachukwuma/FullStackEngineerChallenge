import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Op as OpSymbol } from 'sequelize'
import { DBModel } from '../models';
import { isEmpty } from 'lodash'


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
        jobDefinition
    } = req.body;

    const user_data = {
        name,
        email,
        phone,
        gender,
        role,
        rank,
        jobDefinition: jobDefinition ? jobDefinition : null
    }

    // Save a new User in the database
    Employee.create(user_data)
        .then((data: typeof Employee) => {
            res.send({ data, message: 'New user created' });
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
            res.send({ data });
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message: "Error retrieving employee with id=" + id
            });
        });
}

export async function FetchAllEmployees(req: Request, res: Response) {

    const { name, email } = req.query;

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

// Update employee by the id in the request
export const UpdateEmployee = (req: Request, res: Response) => {

    // Validate params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return
    }

    const id = req.params.id;

    const updateData = {...req.body};
    delete updateData.id;

    Employee.update(updateData, {
        where: { id: id }
    })
        .then(async (num: number) => {
            if (num == 1) {
                const newData = await Employee.findByPk(id)
                res.send({
                    data: newData,
                    message: "Employee was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Employee with id=${id}. Maybe Employee was not found or req.body is empty!`
                });
            }
        })
        .catch((err: any) => {
            res.status(500).send({
                error: err.original,
                message: "Error updating Employee with id=" + id
            });
        });
};

// Delete a Employee with the specified id in the request
export const DeleteEmployee = async (req: Request, res: Response) => {
    const id = req.params.id;

    const whatEmployee = await Employee.findOne({where: {id: id}});
    if (!isEmpty(whatEmployee)) {
        // prevent deletion of super user
        if (whatEmployee.dataValues.email === 'super@admin.com') {
            res.status(500).send({
                message: "Not allowed to delete this user"
            });
            return
        }
    }

    Employee.destroy({
        where: { id: id }
    })
        .then((num: number) => {
            if (num == 1) {
                res.send({
                    message: "Employee was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Employee with id=${id}. Maybe Employee was not found!`
                });
            }
        })
        .catch((err: any) => {
            res.status(500).send({
                message: "Could not delete Employee with id=" + id
            });
        });
};