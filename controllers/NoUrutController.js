import { noUrut } from '../models/NoUrut.js'
import { databaseSIRS } from '../config/Database.js'

export const getNoUrut= (req, res) => {
    noUrut.findAll({
        attributes: ['id','no'],
        where: {
            rl_id: 25
        }
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