import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikTigaHeader, rlTigaTitikTigaDetail, jenisKegiatan } from '../models/RLTigaTitikTiga.js'
import Joi from 'joi'

export const getDataRLTigaTitikTiga = (req, res) => {
    rlTigaTitikTigaHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikTigaDetail,
            include: {
                model: jenisKegiatan
            }
        },
        order:[[{model:rlTigaTitikTigaDetail}, 'jenis_kegiatan_id','ASC']]
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

export const getDataRLTigaTitikTigaDetail = (req, res) => {
    rlTigaTitikTigaDetail.findAll({
        attributes: [
        'id',
        'rl_tiga_titik_tiga_id',
        'user_id',
        'jenis_kegiatan_id',
        'jumlah'
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

export const getRLTigaTitikTigaById = async(req,res)=>{
    rlTigaTitikTigaDetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: jenisKegiatan
            // include: {
            //     model: jenisKegiatan
            // }
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
 
export const insertDataRLTigaTitikTiga =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisKegiatanId: Joi.number().required(),
                    jumlah: Joi.number().required(),
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
    // console.log(req.user);
    let transaction
    try {
        transaction = await databaseSIRS.transaction()
        const resultInsertHeader = await rlTigaTitikTigaHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { 
            transaction
         })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                rl_tiga_titik_tiga_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                jumlah: value.jumlah,
                user_id: req.user.id 
            }
        })

        const resultInsertDetail = await rlTigaTitikTigaDetail.bulkCreate(dataDetail, { 
            transaction, 
            updateOnDuplicate:['jumlah']
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

export const deleteDataRLTigaTitikTiga = async(req, res) => {
    try {
        const count = await rlTigaTitikTigaDetail.destroy({
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

export const updateDataRLTigaTitikTiga = async(req,res)=>{
    try {
        const data = req.body
        try {
            const update = await rlTigaTitikTigaDetail.update( data, 
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
            res.status(201).send({
                status: true,
                message: "Data Diperbaharui",
            })
        } catch (error){
            res.status(400).send({
                status:false,
                message: "Gagal Memperbaharui Data"
            })
        }
    }  catch (error) {
        console.log(error.message)
        res.status(400).send({
            status:false,
            message: "Gagal Memperbaharui Data"
        })
    }
}