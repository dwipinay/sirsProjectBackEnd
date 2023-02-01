import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikTujuh, rlTigaTitikTujuhDetail, jenisGroupKegiatanHeader } from '../models/RLTigaTitikTujuh.js'
import Joi from 'joi'
import { jenisKegiatan } from '../models/JenisKegiatan.js'


export const getDataRLTigaTitikTujuh = (req, res) => {
    rlTigaTitikTujuh.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikTujuhDetail,
            include: {
                model: jenisKegiatan,
                
            include: {
                model: jenisGroupKegiatanHeader
            },
            },
        order: [[{ model: jenisGroupKegiatanHeader }, 'no', 'DESC']]
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

export const getDataRLTigaTitikTujuhDetail = (req, res) => {
    rlTigaTitikTujuhDetail.findAll({
        attributes: ['id','rl_tiga_titik_tujuh_id','user_id','jenis_kegiatan_id','jumlah'],
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

export const getRLTigaTitikTujuhById = async(req,res)=>{
    rlTigaTitikTujuhDetail.findOne({
       
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

export const updateDataRLTigaTitikTujuh = async(req,res)=>{
    try{
        await rlTigaTitikTujuhDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikTujuh = async(req,res)=>{
    try{
        await rlTigaTitikTujuhDetail.destroy({
            where:{
                id: req.params.id
            }
        });
        
        res.status(200).json({message: "RL Deleted"});
    }catch(error){
        console.log(error.message);
    }
}

export const insertDataRLTigaTitikTujuh =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisKegiatanId: Joi.number(),
                    jumlah: Joi.number().min(0)
                    
                })
            ).required()
    })
//console.log(req);
    const { error, value } =  schema.validate(req.body)
    if (error) {
        res.status(404).send({
            status: false,
            message: error.details[0].message,
        })
        return
    }

    let transaction;
    try {
        transaction = await databaseSIRS.transaction();
        const resultInsertHeader = await rlTigaTitikTujuh.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rl_tiga_titik_tujuh_id: resultInsertHeader.id,
                jenis_kegiatan_id: value.jenisKegiatanId,
                jumlah: value.jumlah, 
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikTujuhDetail.bulkCreate(dataDetail, 
            
            { 
                
                transaction, 
                updateOnDuplicate: ['jumlah']
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
        console.log(error.code)
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