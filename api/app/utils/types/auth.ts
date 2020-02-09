import { DBModel } from '../../models';


export type EmployeeType = typeof DBModel.employees;
export type LoginParams = {
    email: string
    password: string
}
export interface UserCredentials extends EmployeeType  {
    isValid: boolean
}
export interface userAuth {
    decodedToken: {
        id: string
        name: string
        email: string
        role: string
        iat: number
        exp: number
    }
}