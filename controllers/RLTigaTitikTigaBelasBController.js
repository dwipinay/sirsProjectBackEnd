import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikTigaBelasB, rlTigaTitikTigaBelasBDetail, golonganObat } from '../models/RLTigaTitikTigaBelasB.js'
import Joi from 'joi'


export const getDataRLTigaTitikTigaBelasB = (req, res) => {
    rlTigaTitikTigaBelasB.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikTigaBelasBDetail,
            include: {
                model: golonganObat
            }
        },
        order: [[{ model: rlTigaTitikTigaBelasBDetail }, 'golongan_obat_id', 'ASC']]
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

export const getDataRLTigaTitikTigaBelasBDetail = (req, res) => {
    rlTigaTitikTigaBelasBDetail.findAll({
        attributes: ['id','rl_tiga_titik_tiga_belas_a_id','user_id','golongan_obat_id','jumlah_item_obat','jumlah_item_obat_rs','jumlah_item_obat_formulatorium'],
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

export const getRLTigaTitikTigaBelasBById = async(req,res)=>{
    rlTigaTitikTigaBelasBDetail.findOne({
       
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

export const updateDataRLTigaTitikTigaBelasB = async(req,res)=>{
    try{
        await rlTigaTitikTigaBelasBDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikTigaBelasB = async(req,res)=>{
    try{
        await rlTigaTitikTigaBelasBDetail.destroy({
            where:{
                id: req.params.id
            }
        });
        
        res.status(200).json({message: "RL Deleted"});
    }catch(error){
        console.log(error.message);
    }
}

export const insertDataRLTigaTitikTigaBelasB =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    golonganObatId: Joi.number(),
                    jumlahItemObat: Joi.number().min(0),
                    jumlahItemObatRs: Joi.number().min(0),
                    jumlahItemObatFormulatorium: Joi.number().min(0)
                    
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
        const resultInsertHeader = await rlTigaTitikTigaBelasB.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            return {
                rl_tiga_titik_tiga_belas_b_id: resultInsertHeader.id,
                golongan_obat_id: value.golonganObatId,
                jumlah_item_obat: value.jumlahItemObat,
                jumlah_item_obat_rs: value.jumlahItemObatRs,
                jumlah_item_obat_formulatorium: value.jumlahItemObatFormulatorium,
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikTigaBelasBDetail.bulkCreate(dataDetail, { 
            
            transaction,
            updateOnDuplicate: ['jumlah_item_obat','jumlah_item_obat_rs','jumlah_item_obat_formulatorium'] 
        
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