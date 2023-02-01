import { databaseSIRS } from "../config/Database.js"
import { rlTigaTitikEnamHeader, rlTigaTitikEnamDetail, rlTigaTItikEnamSpesialis } from "../models/RLTigaTitikEnam.js"
import joi from 'joi'


export const getDataRLTigaTitikEnam = (req, res) => {
    rlTigaTitikEnamHeader.findAll({
        attributes: ['id', 'tahun'],
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

export const getDataRLTigaTitikEnamIdTahun = (req, res) => {
    rlTigaTitikEnamHeader.findAll({
        include:{
            model: rlTigaTitikEnamDetail,
            where:{
                rs_id: req.user.rsId,
                tahun: req.query.tahun
            },
            include: {
                model: rlTigaTItikEnamSpesialis,
                attributes: ['no','nama'], 
            },
            // order: [
            //     [rlTigaTItikEnamSpesialis, 'no','ASC']
            // ]
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

export const getDataRLTigaTitikEnamId = (req, res) => {
    rlTigaTitikEnamDetail.findOne({
        where: {
            id:req.params.id
        }, 
        include:{
            model: rlTigaTItikEnamSpesialis,
        attributes: ['nama']
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

export const insertDataRLTigaTitikEnam = async (req, res) => {
    const schema = joi.object({
        tahun: joi.number().required(),
        data: joi.array()
            .items(
                joi.object().keys({
                    jenisSpesialisId: joi.number(),
                    khusus: joi.number().min(0),
                    besar: joi.number().min(0),
                    sedang: joi.number().min(0),
                    kecil: joi.number().min(0),
                })
            ).required()
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
        const resultInsertHeader = await rlTigaTitikEnamHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        // console.log(resultInsertHeader.id)
        const dataDetail = req.body.data.map((value, index) => {
            let totalall = value.khusus + value.besar + value.sedang + value.kecil
            return {
                tahun: req.body.tahun,
                rs_id: req.user.rsId,
                rl_tiga_titik_enam_id: resultInsertHeader.id,
                jenis_spesialis_id: value.jenisSpesialisId,
                total: totalall,
                khusus: value.khusus,
                besar: value.besar,
                sedang: value.sedang,
                kecil: value.kecil,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikEnamDetail.bulkCreate(dataDetail,
             { 
                transaction ,
                updateOnDuplicate: ['total', 'khusus', 'besar', 'sedang', 'kecil']
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
        if (transaction) {
            await transaction.rollback()
            // console.log(error)
            if(error.name === 'SequelizeUniqueConstraintError'){
                res.status(400).send({
                    status: false,
                    message: "Fail Duplicate Entry"
                    // reason: 'Duplicate Entry'
                })
            } else {
                res.status(400).send({
                    status: false,
                    message: "error"
                })
            }
        }
    }
}

export const deleteDataRLTigaTitikEnamId = async (req, res) => {
    try {
        await rlTigaTitikEnamDetail.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).send({
            status: true,
            message: "data Deleted",
        })
    } catch (error) {
        console.log(error.message);
    }
    // console.log(req)
}

export const updateDataRLTigaTitikEnamId = async (req, res) => {
    try {
        const data = req.body
        data["total"] = data.khusus + data.besar + data.sedang + data.kecil
        // console.log(data)
        try {
            const test = await rlTigaTitikEnamDetail.update( data,
                {
                    where:{
                        id: req.params.id
                    }
                }
            )
            res.status(201).send({
                status: true,
                message: "data Updated",
            })
        } catch (error){
            res.status(400).send({
                status:false,
                message: "Update Data Fail"
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}