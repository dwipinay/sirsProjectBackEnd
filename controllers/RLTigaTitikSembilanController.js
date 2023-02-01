import { databaseSIRS } from "../config/Database.js";
import { rlTigaTitikSembilanHeader, rlTigaTitikSembilanDetail, jenisGroupTindakanHeader, jenisGroupTindakan } from "../models/RLTigaTitikSembilan.js";
import joi from "joi";

export const getDataRLTigaTitikSembilan = (req, res) => {
    rlTigaTitikSembilanHeader.findAll({
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

export const insertDataRLTigaTitikSembilan = async (req, res) => {
    const schema = joi.object({
        tahun: joi.number().required(),
        data: joi.array()
            .items(
                joi.object().keys({
                    jenisTindakanId: joi.number(),
                    jumlah:joi.number().min(0)
                })
            ). required()
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
        const resultInsertHeader = await rlTigaTitikSembilanHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rl_tiga_titik_sembilan_id: resultInsertHeader.id,
                jenis_tindakan_id: value.jenisTindakanId,
                jumlah : value.jumlah,
                user_id: req.user.id,
                tahun: req.body.tahun,
                rs_id: req.user.rsId
            }
        })

        const resultInsertDetail = await rlTigaTitikSembilanDetail.bulkCreate(dataDetail, 
            { 
                transaction,
                updateOnDuplicate: [ 'jumlah'] 
            })
        await transaction.commit()

        res.status(201).send({
            status: true,
            message: "data created",
            data: {
                id: resultInsertHeader.id
            }
        })
        
        // console.log('Success')
    } catch (error) {
        console.log(error)
        if (transaction) {
            await transaction.rollback()
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

export const getDataRLTigaTitikSembilanIdTahun = async (req, res) => {
    rlTigaTitikSembilanHeader.findAll({

        include: {
            model: rlTigaTitikSembilanDetail,        
            where: {
                rs_id: req.user.rsId,
                tahun: req.query.tahun
            },
            include: {
                model: jenisGroupTindakan,
                // attributes: ['id', 'nama'],
                include : {
                    model:  jenisGroupTindakanHeader
                }
            },
        },
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

export const getDataRLTigaTitikSembilanId = async (req, res) => {
    rlTigaTitikSembilanDetail.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: jenisGroupTindakan,
            // attributes: ['id', 'nama'],
            include : {
                model:  jenisGroupTindakanHeader
            }
        },
    }).then((results) => {
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

export const updateDataRLTigaTitikSembilanId = async (req, res) => {
    try {
        const data = req.body
        try {
            const update = await rlTigaTitikSembilanDetail.update( data, 
                {
                    where: {
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
    }  catch (error) {
        console.log(error.message)
        res.status(400).send({
            status:false,
            message: "Update Data Fail"
        })
    }
}

export const deleteDataRLTigaTitikSembilanId = async (req, res) => {
    try {
        await rlTigaTitikSembilanDetail.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).send({
            status: true,
            message: "Delete Data Success"
        })
    }catch (error) {
        console.log(error.message);
    }
}