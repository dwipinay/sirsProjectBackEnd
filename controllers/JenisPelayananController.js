import { jenisPelayanan } from '../models/JenisPelayanan.js'

export const getDataJenisPelayanan = (req, res) => {
    jenisPelayanan.findAll({
        attributes: ['id','no','nama'],
        where: {
            rl_id: req.query.rlid
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