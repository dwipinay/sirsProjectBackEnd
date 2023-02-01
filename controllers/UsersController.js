import { users, insertData } from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import jsonWebToken from 'jsonwebtoken'
import Joi from 'joi'

export const getDataUser = (req, res) => {
    users.findAll({
        attributes: ['id','nama','email','password','created_at', 'modified_at']
    })
    .then((results) => {
        res.status(200).send({
            status: true,
            message: "data found",
            data: results
        })
    })
    .catch((err) => {
        res.status(422).send({
            status: false,
            message: err
        })
        return
    })
}

export const login = (req, res) => {
    const schema = Joi.object({
        userName: Joi.string()
            .required(),
        password: Joi.string()
            .required()
    });

    const { error, value } =  schema.validate(req.body)
    
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    users.findAll({
        attributes: ['id','nama','email','password', 'rs_id','created_at', 'modified_at'],
        where: {
            email: req.body.userName
        }
    })
    .then((results) => {
        if (!results.length) {
            res.status(404).send({
                status: false,
                message: 'email not found'
            })
            return
        }
        bcrypt.compare(req.body.password, results[0].password, (error, compareResult) => {
            if (compareResult == false) {
                res.status(404).send({
                    status: false,
                    message: 'wrong password'
                })
                return
            }
            const payloadObject = {
                id: results[0].id,
                nama: results[0].nama,
                email: results[0].email,
                rsId: results[0].rs_id
            }

            const accessToken = jsonWebToken.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN})
            jsonWebToken.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
                const refreshToken = jsonWebToken.sign(payloadObject, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN})
                users.update({refresh_token: refreshToken},{
                    where: {
                        id: results[0].id
                    }
                })
                .then(() => {
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        // maxAge: 24 * 60 * 60 * 1000
                        maxAge: 1000 * 60 * 60 * 24
                    })
                    res.status(201).send({
                        status: true,
                        message: "access token created",
                        data: {
                            name: results[0].nama,
                            access_token: accessToken
                        }
                    })
                })
                .catch((err) => {
                    res.status(404).send({
                        status: false,
                        message: err
                    })
                    return
                })
            })
        })
    })
    .catch((err) => {
        res.status(404).send({
            status: false,
            message: err
        })
        return
    })
}

export const logout = (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        res.status(204).send({
            status: false,
            message: 'No'
        })
        return
    }
    users.findAll({
        where: {
            refresh_token: refreshToken
        }
    })
    .then((results) => {
        users.update({refresh_token: null},{
            where: {
                id: results[0].id
            }
        })
        .then((resultsUpdate) => {
            res.clearCookie('refreshToken')
            res.sendStatus(200)
        })
    })
    .catch((err) => {
        res.status(404).send({
            status: false,
            message: err
        })
        return
    })

}

export const insertDataUser = (req, res) => {
    const schema = Joi.object({
        nama: Joi.string()
            .required(),
        email: Joi.string()
            .required(),
        password: Joi.string()
            .required(),
        rsId: Joi.string()
            .required().allow(null)
    })

    const { error, value } =  schema.validate(req.body)
    
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    const saltRound = 10
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRound, (err, hash) => {
        if (err) {
            res.status(422).send({
                status: false,
                message: err
            })
            return
        }
        
        const data = [
            req.body.nama,
            req.body.email,
            hash,
            req.body.rsId
        ]
        
        insertData(data, (err, results) => {
            if (err) {
                res.status(422).send({
                    status: false,
                    message: err
                })
                return
            }
            res.status(201).send({
                status: true,
                message: "data created",
                data: {
                    id: results[0]
                }
            })
        })
    })
}

export const changePassword = async (req, res) => {
    const schema = Joi.object({
        passwordLama: Joi.string()
            .required(),
        passwordBaru: Joi.string()
            .required(),
        passwordBaruConfirmation: Joi.string()
            .required().valid(Joi.ref('passwordBaru'))
    })

    const { error, value } =  schema.validate(req.body)
    
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    try {
        const passwordLama = await users.findOne({
            attributes: ['password'],
            where: {
                id: req.params.id
            }
        })

        const compareResult = await bcrypt.compare(req.body.passwordLama, passwordLama.dataValues.password)
        if (!compareResult) {
            res.status(404).json({
                status: false,
                message: 'password lama tidak sesuai'
            })
            return
        }

        const saltRound = 10
        const plainPassword = req.body.passwordBaru
        const password = await bcrypt.hash(plainPassword, saltRound)
        const update = await users.update(
            {
                password: password
            },
            {
                where: {
                    id: req.params.id
                }
            }
        )
        res.status(200).json({
            status: true,
            message: update
        })
    } catch (error) {
        console.log(error.message);
    }
}