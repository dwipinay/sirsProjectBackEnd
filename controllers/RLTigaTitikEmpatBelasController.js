import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikEmpatBelasHeader, rlTigaTitikEmpatBelasDetail, jenisSpesialis } from '../models/RLTigaTitikEmpatBelas.js'
import Joi from 'joi'

export const getDataRLTigaTitikEmpatBelas = (req, res) => {
    rlTigaTitikEmpatBelasHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikEmpatBelasDetail,
            include: {
                model: jenisSpesialis
            }
        },
        order:[[{model:rlTigaTitikEmpatBelasDetail}, 'jenis_spesialis_id','ASC']]
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

export const insertDataRLTigaTitikEmpatBelas =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisSpesialisId: Joi.number().required(),
                    rujukanDiterimaDariPuskesmas: Joi.number().required(),
                    rujukanDiterimaDariFasilitasKesehatanLain: Joi.number().required(),
                    rujukanDiterimaDariRsLain: Joi.number().required(),
                    rujukanDikembalikanKePuskesmas: Joi.number().required(),
                    rujukanDikembalikanKeFasilitasKesehatanLain: Joi.number().required(),
                    rujukanDikembalikanKeRsAsal: Joi.number().required(),
                    dirujukanPasienRujukan: Joi.number().required(),
                    dirujukPasienDatangSendiri: Joi.number().required(),
                    dirujukDiterimaKembali: Joi.number().required()
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
        const resultInsertHeader = await rlTigaTitikEmpatBelasHeader.create({
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
                rl_tiga_titik_empat_belas_id: resultInsertHeader.id,
                jenis_spesialis_id: value.jenisSpesialisId,
                rujukan_diterima_dari_puskesmas: value.rujukanDiterimaDariPuskesmas,
                rujukan_diterima_dari_fasilitas_kesehatan_lain: value.rujukanDiterimaDariFasilitasKesehatanLain,
                rujukan_diterima_dari_rs_lain: value.rujukanDiterimaDariRsLain,
                rujukan_dikembalikan_ke_puskesmas: value.rujukanDikembalikanKePuskesmas,
                rujukan_dikembalikan_ke_fasilitas_kesehatan_lain: value.rujukanDikembalikanKeFasilitasKesehatanLain,
                rujukan_dikembalikan_ke_rs_asal: value.rujukanDikembalikanKeRsAsal,
                dirujukan_pasien_rujukan: value.dirujukanPasienRujukan,
                dirujuk_pasien_datang_sendiri: value.dirujukPasienDatangSendiri,
                dirujuk_diterima_kembali: value.dirujukDiterimaKembali,
                user_id: req.user.id 
            }
        })
 
        const resultInsertDetail = await rlTigaTitikEmpatBelasDetail.bulkCreate(dataDetail, { 
            transaction, 
            updateOnDuplicate:[
            'rujukan_diterima_dari_puskesmas',
            'rujukan_diterima_dari_fasilitas_kesehatan_lain',
            'rujukan_diterima_dari_rs_lain',
            'rujukan_dikembalikan_ke_puskesmas',
            'rujukan_dikembalikan_ke_fasilitas_kesehatan_lain',
            'rujukan_dikembalikan_ke_rs_asal',
            'dirujukan_pasien_rujukan',
            'dirujuk_pasien_datang_sendiri',
            'dirujuk_diterima_kembali'
            ]
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

export const deleteDataRLTigaTitikEmpatBelas = async(req, res) => {
    try {
        const count = await rlTigaTitikEmpatBelasDetail.destroy({
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

export const getDataRLTigaTitikEmpatBelasDetail = (req, res) => {
    rlTigaTitikEmpatBelasDetail.findAll({
        attributes: [
            'id',
            'rl_tiga_titik_empat_belas_id',
            'user_id',
            'jenis_spesialis_id',
            'rujukan_diterima_dari_puskesmas',
            'rujukan_diterima_dari_fasilitas_kesehatan_lain',
            'rujukan_diterima_dari_rs_lain',
            'rujukan_dikembalikan_ke_puskesmas',
            'rujukan_dikembalikan_ke_fasilitas_kesehatan_lain',
            'rujukan_dikembalikan_ke_rs_asal',
            'dirujukan_pasien_rujukan',
            'dirujuk_pasien_datang_sendiri',
            'dirujuk_diterima_kembali',
        ],
        where:{
            id: req.params.id
        },
        include: {
            model: jenisSpesialis,
            attributes: ['nama']
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

export const updateDataRLTigaTitikEmpatBelas = async(req,res)=>{
    try{
        const data = req.body
        try {
            const update = await rlTigaTitikEmpatBelasDetail.update( data, 
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

export const getRLTigaTitikEmpatBelasById = async(req,res)=>{
    rlTigaTitikEmpatBelasDetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: jenisSpesialis
            // include: {
            //     model: jenisSpesialis
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
 



