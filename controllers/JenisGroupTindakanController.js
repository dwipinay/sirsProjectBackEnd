import { jenisTindakan } from "../models/JenisTindakan.js";
import { jenisGroupTindakan, jenisGroupTindakanHeader, RL } from "../models/JenisGroupTindakan.js";

export const getDataJenisTindakan  = (req, res) => {
    jenisTindakan.findAll({
        attributes: ['id', 'no', 'nama'],
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

export const getDataGroupJenisTindakan = (req, res) => {
    jenisGroupTindakan.findAll({
        attributes: ['id', 'no', 'nama'],
        include: {
            model: jenisGroupTindakanHeader,
            where: {
                rl_id: req.query.rlid
            },
            required: false
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