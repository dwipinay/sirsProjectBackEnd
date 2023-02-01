import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikDuaBelas, rlTigaTitikDuaBelasDetail, metoda } from '../models/RLTigaTitikDuaBelas.js'
import Joi from 'joi'


export const getDataRLTigaTitikDuaBelas = (req, res) => {
    rlTigaTitikDuaBelas.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikDuaBelasDetail,
            include: {
                model: metoda
            }
        },
        order: [[{ model: rlTigaTitikDuaBelasDetail }, 'metoda_id', 'ASC']]
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

export const getDataRLTigaTitikDuaBelasDetail = (req, res) => {
    rlTigaTitikDuaBelasDetail.findAll({
        attributes: ['id','rl_tiga_titik_dua_belas_id','user_id','metoda_id','konseling_anc','konseling_pasca_persalinan', 
        'kb_baru_bukan_rujukan', 'kb_baru_rujukan_inap','kb_baru_rujukan_jalan', 'kb_baru_total','kb_baru_pasca_persalinan',
        'kb_baru_abortus','kb_baru_lainnya','kunjungan_ulang','keluhan_efek_samping_jumlah','keluhan_efek_samping_dirujuk' ],
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

export const getRLTigaTitikDuaBelasById = async(req,res)=>{
    rlTigaTitikDuaBelasDetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: metoda
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

export const updateDataRLTigaTitikDuaBelas = async(req,res)=>{
    try{
        await rlTigaTitikDuaBelasDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({message: "RL 3.12 Updated"});
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikDuaBelas = async(req,res)=>{
    try{
        await rlTigaTitikDuaBelasDetail.destroy({
            where:{
                id: req.params.id
            }
        });
        
        res.status(200).json({message: "RL 3.12 Deleted"});
    }catch(error){
        console.log(error.message);
    }
}

export const insertDataRLTigaTitikDuaBelas =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    metodaId: Joi.number(),
                    konselingAnc: Joi.number().min(0),
                    konselingPascaPersalinan: Joi.number().min(0),
                    kbBaruBukanRujukan: Joi.number().min(0),
                    kbBaruRujukanInap: Joi.number().min(0),
                    kbBaruRujukanJalan: Joi.number().min(0),
                    kbBaruTotal: Joi.number().min(0),
                    kbBaruPascaPersalinan: Joi.number().min(0),
                    kbBaruAbortus: Joi.number().min(0),
                    kbBaruLainnya: Joi.number().min(0),
                    kunjunganUlang: Joi.number().min(0),
                    keluhanEfekSampingJumlah: Joi.number().min(0),
                    keluhanEfekSampingDirujuk: Joi.number().min(0)
                    
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
        const resultInsertHeader = await rlTigaTitikDuaBelas.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            let jumlahKbBaruTotal = value.kbBaruBukanRujukan + value.kbBaruRujukanInap + value.kbBaruRujukanJalan
            return {
                rl_tiga_titik_dua_belas_id: resultInsertHeader.id,
                metoda_id: value.metodaId,
                konseling_anc: value.konselingAnc,
                konseling_pasca_persalinan: value.konselingPascaPersalinan,
                kb_baru_bukan_rujukan: parseInt(value.kbBaruBukanRujukan),
                kb_baru_rujukan_inap: parseInt(value.kbBaruRujukanInap),
                kb_baru_rujukan_jalan: parseInt(value.kbBaruRujukanJalan),
                kb_baru_total: jumlahKbBaruTotal,
                kb_baru_pasca_persalinan: value.kbBaruPascaPersalinan,
                kb_baru_abortus: value.kbBaruAbortus,
                kb_baru_lainnya: value.kbBaruLainnya,
                kunjungan_ulang: value.kunjunganUlang,
                keluhan_efek_samping_jumlah: value.keluhanEfekSampingJumlah,
                keluhan_efek_samping_dirujuk: value.keluhanEfekSampingDirujuk,
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                user_id: req.user.id
            }
        })

        const resultInsertDetail = await rlTigaTitikDuaBelasDetail.bulkCreate(dataDetail, { 
            
            transaction,
            updateOnDuplicate: ['konseling_anc','konseling_pasca_persalinan', 
            'kb_baru_bukan_rujukan', 'kb_baru_rujukan_inap','kb_baru_rujukan_jalan', 'kb_baru_total','kb_baru_pasca_persalinan',
            'kb_baru_abortus','kb_baru_lainnya','kunjungan_ulang','keluhan_efek_samping_jumlah','keluhan_efek_samping_dirujuk']
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