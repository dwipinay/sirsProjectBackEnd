import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikSepuluhHeader, rlTigaTitikSepuluhDetail, jenisKegiatan } from '../models/RLTigaTitikSepuluh.js'
import Joi from 'joi'


export const getDatarlTigaTitikSepuluh = (req, res) => {
    rlTigaTitikSepuluhHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikSepuluhDetail,
            include: {
                model: jenisKegiatan
            },
            order: [
                [rlTigaTitikSepuluhDetail, 'jenis_kegiatan_id', 'DESC']
            ]
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

export const getDatarlTigaTitikSepuluhDetail = (req, res) => {
    rlTigaTitikSepuluhDetail.findAll({
        attributes: [
        'id',
        'rl_tiga_titik_sepuluh_id',
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

export const getrlTigaTitikSepuluhById = async(req,res)=>{
    rlTigaTitikSepuluhDetail.findOne({
       
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

export const updateDatarlTigaTitikSepuluh = async(req,res)=>{
    try{
        await rlTigaTitikSepuluhDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "Rekapitulasi Laporan Telah Diperbaharui"});
    }catch(error){
        console.log(error.message);
    }
}
 
export const insertDataRLTigaTitikSepuluh =  async (req, res) => {
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

    let transaction
    try {
        transaction = await databaseSIRS.transaction()
        const resultInsertHeader = await rlTigaTitikSepuluhHeader.create({
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
                rl_tiga_titik_sepuluh_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                jumlah: value.jumlah,
                user_id: req.user.id 
            }
        })

        const resultInsertDetail = await rlTigaTitikSepuluhDetail.bulkCreate(dataDetail, { 
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

export const deleteDataRLTigaTitikSepuluh = async(req, res) => {
    try {
        const count = await rlTigaTitikSepuluhDetail.destroy({
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