import { icd10 } from '../models/Icd10.js'

export const getIcd10= (req, res) => {
    icd10.findAll({
        attributes: ['code','description'],
        
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