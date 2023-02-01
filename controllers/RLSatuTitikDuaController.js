import { databaseSIRS } from '../config/Database.js'
import { rlSatuTitikDuaHeader, rlSatuTitikDuaDetail } from "../models/RLSatuTitikDua.js";
import Joi from "joi";

export const getDatarlSatuTitikDua = (req, res) => {
    rlSatuTitikDuaHeader.findAll({
        attributes: ['id', 'tahun'],
        where: {
            rs_id: req.user.rsId,
            tahun: req.query.tahun,
        },
        include: {
            model: rlSatuTitikDuaDetail
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
export const getDatarlSatuTitikDuaDetail = (req, res) => {
    rlSatuTitikDuaDetail.findAll({
        attributes: [
            'id',
            'rl_satu_titik_dua_id',
            'user_id',
            'bor',
        ],
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

export const getrlSatuTitikDuaById = async (req, res) => {
    rlSatuTitikDuaDetail.findOne({

        where: {
            id: req.params.id
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
export const updateDatarlSatuTitikDua = async (req, res) => {
    try {
        await rlSatuTitikDuaDetail.update(req.body, {
            where: {
                id: req.params.id,
            }
        });
        res.status(200).json({ message: "Rekapitulasi Laporan Telah Diperbaharui" });
    } catch (error) {
        console.log(error.message);
    }
}

export const insertDataRLSatuTitikDua = async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        los: Joi.number().required(),
        bor: Joi.number().required(),
        toi: Joi.number().required(),
        bto: Joi.number().required(),
        ndr: Joi.number().required(),
        gdr: Joi.number().required(),
        rataKunjungan: Joi.number().required()
    })

    const { error, value } = schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    let transaction
    try {
        transaction = await databaseSIRS.transaction()
        const resultInsertHeader = await rlSatuTitikDuaHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, {
            transaction
        })
        const dataDetail = {
            "rs_id": req.user.rsId,
            "rl_satu_titik_dua_id": resultInsertHeader.id,
            "user_id": req.user.id,
            "tahun": req.body.tahun,
            "bor": req.body.bor,
            "los": req.body.los,
            "bto": req.body.bto,
            "toi": req.body.toi,
            "ndr": req.body.ndr,
            "gdr": req.body.gdr,
            "rata_kunjungan": req.body.rataKunjungan,
        }

        const resultInsertDetail = await rlSatuTitikDuaDetail.create(dataDetail, {
            transaction,
            updateOnDuplicate: ['bor', 'los', 'bto', 'toi', 'ndr', 'gdr', 'rata_kunjungan']
        })
        await transaction.commit()
        res.status(201).send({
            status: true,
            message: "data created",
            data: {
                id: resultInsertHeader.id
            }
        })
    } catch (error) {
        console.log(error)
        if (transaction) {
            await transaction.rollback()
        }
    }
}

export const deleteDataRLSatuTitikDua = async (req, res) => {
    try {
        const count = await rlSatuTitikDuaDetail.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).send({
            status: true,
            message: "data deleted successfully",
            data: {
                'deleted_rows': count
            }
        })
    } catch (error) {
        res.status(404).send({
            status: false,
            message: error
        })
    }
}