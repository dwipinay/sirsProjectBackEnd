import { databaseSIRS } from '../config/Database.js'
import { rlLimaTitikSatuHeader, rlLimaTitikSatuDetail, jenisKegiatan } from '../models/RLLimaTitikSatu.js'
import Joi from 'joi'

export const getDataRLLimaTitikSatu = (req, res) => {
    rlLimaTitikSatuHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlLimaTitikSatuDetail,
            include: {
                model: jenisKegiatan
            }
        },
        order: [[{ model: rlLimaTitikSatuDetail }, 'jenis_kegiatan_id', 'ASC']]
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

export const insertDataRLLimaTitikSatu =  async (req, res) => {
    console.log(req.user)
    const schema = Joi.object({
        tahun: Joi.number().required(),
        tahunDanBulan: Joi.date().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisKegiatanId: Joi.number().required(),
                    jumlah: Joi.number().required()
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
        const resultInsertHeader = await rlLimaTitikSatuHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahunDanBulan,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rs_id: req.user.rsId,
                tahun: req.body.tahunDanBulan,
                rl_lima_titik_satu_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                jumlah: value.jumlah,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlLimaTitikSatuDetail.bulkCreate(dataDetail, { 
            transaction,
            updateOnDuplicate: [
                "jumlah",
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
        console.log(error)
        if (transaction) {
            await transaction.rollback()
        }
        res.status(400).send({
            status: false,
            message: "data not created",
            error: error
        })
    }
}

export const updateDataRLLimaTitikSatu = async(req,res)=>{
    try{
        await rlLimaTitikSatuDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLLimaTitikSatu = async(req, res) => {
    try {
        const count = await rlLimaTitikSatuDetail.destroy({
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

export const getRLLimaTitikSatuById = async(req,res)=>{
    rlLimaTitikSatuDetail.findOne({
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