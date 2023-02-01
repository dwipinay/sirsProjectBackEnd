import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikTigaBelasA, rlTigaTitikTigaBelasADetail, golonganObat } from '../models/RLTigaTitikTigaBelasA.js'
import Joi from 'joi'


export const getDataRLTigaTitikTigaBelasA = (req, res) => {
    rlTigaTitikTigaBelasA.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikTigaBelasADetail,
            include: {
                model: golonganObat
            }
        },
        order: [[{ model: rlTigaTitikTigaBelasADetail }, 'golongan_obat_id', 'ASC']]
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

export const getDataRLTigaTitikTigaBelasADetail = (req, res) => {
    rlTigaTitikTigaBelasADetail.findAll({
        attributes: ['id','rl_tiga_titik_tiga_belas_a_id','user_id','golongan_obat_id','rawat_jalan','igd','rawat_inap'],
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

export const getRLTigaTitikTigaBelasAById = async(req,res)=>{
    rlTigaTitikTigaBelasADetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: golonganObat
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

export const updateDataRLTigaTitikTigaBelasA = async(req,res)=>{
    try{
        await rlTigaTitikTigaBelasADetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikTigaBelasA = async(req,res)=>{
    try{
        await rlTigaTitikTigaBelasADetail.destroy({
            where:{
                id: req.params.id
            }
        });
        
        res.status(200).json({message: "RL Deleted"});
    }catch(error){
        console.log(error.message);
    }
}

export const insertDataRLTigaTitikTigaBelasA =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    golonganObatId: Joi.number(),
                    rawatJalan: Joi.number().min(0),
                    igd: Joi.number().min(0),
                    rawatInap: Joi.number().min(0)
                    
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
        const resultInsertHeader = await rlTigaTitikTigaBelasA.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rl_tiga_titik_tiga_belas_a_id: resultInsertHeader.id,
                golongan_obat_id: value.golonganObatId,
                rawat_jalan: value.rawatJalan,
                igd: value.igd,
                rawat_inap: value.rawatInap,
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikTigaBelasADetail.bulkCreate(dataDetail, { 
            
            transaction,
            updateOnDuplicate: ['rawat_jalan','igd','rawat_inap']
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