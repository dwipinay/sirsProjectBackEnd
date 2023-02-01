import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikEmpatHeader, rlTigaTitikEmpatDetail, jenisKegiatan } from '../models/RLTigaTitikEmpat.js'
import Joi from 'joi'

export const getDataRLTigaTitikEmpat = (req, res) => {
    rlTigaTitikEmpatHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikEmpatDetail,
            include: {
                model: jenisKegiatan
            }
        },
        order: [[{ model: rlTigaTitikEmpatDetail }, 'jenis_kegiatan_id', 'ASC']]
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

export const insertDataRLTigaTitikEmpat =  async (req, res) => {
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
                    rmHidup: Joi.number().required(),
                    rmMati: Joi.number().required(),
                    rmTotal: Joi.number().required(),
                    rnmHidup: Joi.number().required(),
                    rnmMati: Joi.number().required(),
                    rnmTotal: Joi.number().required(),
                    nrHidup: Joi.number().required(),
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
        const resultInsertHeader = await rlTigaTitikEmpatHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                rl_tiga_titik_empat_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                rmRumahSakit: value.rmRumahSakit,
                rmBidan: value.rmBidan,
                rmPuskesmas: value.rmPuskesmas,
                rmFaskesLainnya: value.rmFaskesLainnya,
                rmHidup: value.rmHidup,
                rmMati: value.rmMati,
                rmTotal: value.rmTotal,
                rnmHidup: value.rnmHidup,
                rnmMati: value.rnmMati,
                rnmTotal: value.rnmTotal,
                nrHidup: value.nrHidup,
                nrMati: value.nrMati,
                nrTotal: value.nrTotal,
                dirujuk: value.dirujuk,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikEmpatDetail.bulkCreate(dataDetail, { 
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

export const updateDataRLTigaTitikEmpat = async(req,res)=>{
    try{
        await rlTigaTitikEmpatDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikEmpat = async(req, res) => {
    try {
        const count = await rlTigaTitikEmpatDetail.destroy({
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

export const getRLTigaTitikEmpatById = async(req,res)=>{
    rlTigaTitikEmpatDetail.findOne({
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