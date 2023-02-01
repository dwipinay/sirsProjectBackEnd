import { golonganObat } from '../models/GolonganObat.js'
import { databaseSIRS } from '../config/Database.js'

export const getGolonganObat = (req, res) => {
    golonganObat.findAll({
        attributes: ['id','no','nama'],
        // where: {
        //     rl_id: 12
        // }
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