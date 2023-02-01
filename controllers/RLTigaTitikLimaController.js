import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikLimaHeader, rlTigaTitikLimaDetail, jenisKegiatan, jenisGroupKegiatanHeader  } from '../models/RLTigaTitikLima.js'
import Joi from 'joi'

export const getDataRLTigaTitikLima = (req, res) => {
    rlTigaTitikLimaHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikLimaDetail,
            include: {
                model: jenisKegiatan,
                
            include: {
                model: jenisGroupKegiatanHeader
            },
            },
            order: [[{ model: jenisGroupKegiatanHeader }, 'no', 'DESC']]
        }
        // include:{
        //     model: rlTigaTitikLimaDetail,
        //     include: {
        //         model: jenisKegiatan
        //     }
        // },
        // order: [[{ model: rlTigaTitikLimaDetail }, 'jenis_kegiatan_id', 'ASC']]
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

export const insertDataRLTigaTitikLima =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisKegiatanId: Joi.number().required(),
                    rmRumahSakit: Joi.number().required(),
                    rmBidan: Joi.number().required(),
                    rmPuskesmas: Joi.number().required(),
                    rmFaskesLainnya: Joi.number().required(),
                    rmMati: Joi.number().required(),
                    rmTotal: Joi.number().required(),
                    rnmMati: Joi.number().required(),
                    rnmTotal: Joi.number().required(),
                    nrMati: Joi.number().required(),
                    nrTotal: Joi.number().required(),
                    dirujuk: Joi.number().required()
                }).required()
            ).required()
    })

    const { error, value } =  schema.validate(req.body)
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
        const resultInsertHeader = await rlTigaTitikLimaHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                rl_tiga_titik_lima_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                rmRumahSakit: value.rmRumahSakit,
                rmBidan: value.rmBidan,
                rmPuskesmas: value.rmPuskesmas,
                rmFaskesLainnya: value.rmFaskesLainnya,
                rmMati: value.rmMati,
                rmTotal: value.rmTotal,
                rnmMati: value.rnmMati,
                rnmTotal: value.rnmTotal,
                nrMati: value.nrMati,
                nrTotal: value.nrTotal,
                dirujuk: value.dirujuk,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikLimaDetail.bulkCreate(dataDetail, { 
            transaction,
            updateOnDuplicate: [
                "rmRumahSakit",
                "rmBidan",
                "rmPuskesmas",
                "rmFaskesLainnya",
                "rmHidup",
                "rmMati",
                "rmTotal",
                "rnmHidup",
                "rnmMati",
                "rnmTotal",
                "nrHidup",
                "nrMati",
                "nrTotal",
                "dirujuk",
            ],
        })
        // console.log(resultInsertDetail[0].id)
        await transaction.commit()
        res.status(201).send({
            status: true,
            message: "data created",
            data: {
                id: resultInsertHeader.id
            }
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            status: false,
            message: "data not created",
            error: "duplicate data"
        })
        if (transaction) {
            await transaction.rollback()
        }
    }
}

export const updateDataRLTigaTitikLima = async(req,res)=>{
    try{
        await rlTigaTitikLimaDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikLima = async(req, res) => {
    try {
        const count = await rlTigaTitikLimaDetail.destroy({
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

export const getRLTigaTitikLimaById = async(req,res)=>{
    rlTigaTitikLimaDetail.findOne({
        where:{
            id:req.params.id
        },
        include:{
            model: jenisKegiatan
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