import { databaseSIRS } from '../config/Database.js'
import { rlLimaTitikEmpat, rlLimaTitikEmpatDetail, noUrut } from '../models/RLLimaTitikEmpat.js'
import Joi from 'joi'


export const getDataRLLimaTitikEmpat = (req, res) => {
    rlLimaTitikEmpat.findAll({
        attributes: ['id','tahun'],
       
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlLimaTitikEmpatDetail,
            include: {
                model: noUrut
            },
        }, 
        order: [
            [rlLimaTitikEmpatDetail, 'jumlah_kasus_baru', 'DESC']
        ],
        subQuery: false,
        limit: 10,
        offset: (1 - 1) * 10
        
        
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

export const getDataRLLimaTitikEmpatDetail = (req, res) => {
    rlLimaTitikEmpatDetail.findAll({
        attributes: ['id','rl_lima_titik_empat_id','user_id','no_urut_id','kode_icd_10','deskripsi', 'kasus_baru_Lk','kasus_baru_Pr',
                    'jumlah_kasus_baru', 'jumlah_kunjungan'],
        order :  [
            // ['id', 'DESC'],
            ['jumlah_kasus_baru', 'ASC'],
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

export const getRLLimaTitikEmpatById = async(req,res)=>{
    rlLimaTitikEmpatDetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: noUrut
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

export const updateDataRLLimaTitikEmpat = async(req,res)=>{
    try{
        await rlLimaTitikEmpatDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLLimaTitikEmpat = async(req,res)=>{
    try{
        await rlLimaTitikEmpatDetail.destroy({
            where:{
                id: req.params.id
            }
        });
        
        res.status(200).json({message: "RL Deleted"});
    }catch(error){
        console.log(error.message);
    }
}

export const insertDataRLLimaTitikEmpat =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.date().required(),
        tahunDanBulan: Joi.date().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    noUrutId: Joi.number(),
                    kodeIcd10: Joi.string().required(),
                    deskripsi: Joi.string(),
                    kasusBaruLk: Joi.number().min(0),
                    kasusBaruPr: Joi.number().min(0),
                    jumlahKasusBaru: Joi.number().min(0),
                    jumlahKunjungan: Joi.number().min(0)
                    
                })
            ).required()
    })
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
        const resultInsertHeader = await rlLimaTitikEmpat.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahunDanBulan,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            let jumlahKasusBaru = value.kasusBaruLk + value.kasusBaruPr
            return {
                rl_lima_titik_empat_id: resultInsertHeader.id,
                no_urut_id: value.noUrutId,
                kode_icd_10: value.kodeIcd10, 
                deskripsi: value.deskripsi, 
                kasus_baru_Lk: parseInt(value.kasusBaruLk), 
                kasus_baru_Pr: parseInt(value.kasusBaruPr), 
                jumlah_kasus_baru:jumlahKasusBaru, 
                jumlah_kunjungan: value.jumlahKunjungan, 
                rs_id: req.user.rsId,
                tahun: req.body.tahunDanBulan,
                user_id: req.user.id
            }
        })

        if (dataDetail[0].jumlah_kunjungan >= dataDetail[0].jumlah_kasus_baru ) {
        const resultInsertDetail = await rlLimaTitikEmpatDetail.bulkCreate(dataDetail, 
            
            { 
                
                transaction, 
                updateOnDuplicate: ['kode_icd_10','deskripsi','kasus_baru_Lk','kasus_baru_Pr',
                'jumlah_kasus_baru', 'jumlah_kunjungan']
            })
            
        
        await transaction.commit()
        res.status(201).send({
            status: true,
            message: "data created",
            data: {
                id: resultInsertHeader.id
            }
        })
    } else {
        res.status(400).send({
        status: false,
        message: "Data Jumlah Kunjungan kurang dari jumlah kasus baru"
        })
    }
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