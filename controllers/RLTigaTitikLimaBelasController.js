import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikLimaBelasHeader, rlTigaTitikLimaBelasDetail, caraPembayaran } from '../models/RLTigaTitikLimaBelas.js'
import Joi from 'joi'

export const getDataRLTigaTitikLimaBelas = (req, res) => {
    rlTigaTitikLimaBelasHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikLimaBelasDetail,
            include: {
                model: caraPembayaran
            }
        },
        order:[[{model:rlTigaTitikLimaBelasDetail}, 'cara_pembayaran_id','ASC']]
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

export const getDataRLTigaTitikLimaBelasDetail = (req, res) => {
    rlTigaTitikLimaBelasDetail.findAll({
        attributes: [
            'id',
            'rl_tiga_titik_lima_belas_id',
            'user_id',
            'cara_pembayaran_id',
            'pasien_rawat_inap_jpk',
            'pasien_rawat_inap_jld',
            'jumlah_pasien_rawat_jalan',
            'jumlah_pasien_rawat_jalan_lab',
            'jumlah_pasien_rawat_jalan_rad',
            'jumlah_pasien_rawat_jalan_ll',
        ],
        where:{
            id: req.params.id
        },
        include: {
            model: caraPembayaran,
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

export const getRLTigaTitikLimaBelasById = async(req,res)=>{
    rlTigaTitikLimaBelasDetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: caraPembayaran
            // include: {
            //     model: caraPembayaran
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

export const updateDataRLTigaTitikLimaBelas = async(req,res)=>{
    try{
        const data = req.body
        try {
            const update = await rlTigaTitikLimaBelasDetail.update( data, 
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
 
export const insertDataRLTigaTitikLimaBelas =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    caraPembayaranId: Joi.number().required(),
                    pasienRawatInapJpk: Joi.number().required(),
                    pasienRawatInapJld: Joi.number().required(),        
                    jumlahPasienRawatJalan: Joi.number().required(),
                    jumlahPasienRawatJalanLab: Joi.number().required(),
                    jumlahPasienRawatJalanRad: Joi.number().required(),
                    jumlahPasienRawatJalanLl: Joi.number().required()
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
        const resultInsertHeader = await rlTigaTitikLimaBelasHeader.create({
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
                rl_tiga_titik_lima_belas_id: resultInsertHeader.id,
                cara_pembayaran_id: value.caraPembayaranId,
                pasien_rawat_inap_jpk: value.pasienRawatInapJpk,
                pasien_rawat_inap_jld: value.pasienRawatInapJld,
                jumlah_pasien_rawat_jalan: value.jumlahPasienRawatJalan,
                jumlah_pasien_rawat_jalan_lab: value.jumlahPasienRawatJalanLab,
                jumlah_pasien_rawat_jalan_rad: value.jumlahPasienRawatJalanRad,
                jumlah_pasien_rawat_jalan_ll: value.jumlahPasienRawatJalanLl,
                user_id: req.user.id 
            }
        })

        const resultInsertDetail = await rlTigaTitikLimaBelasDetail.bulkCreate(dataDetail, { 
            transaction, 
            updateOnDuplicate:[
            'pasien_rawat_inap_jpk',
            'pasien_rawat_inap_jld',
            'jumlah_pasien_rawat_jalan',
            'jumlah_pasien_rawat_jalan_lab',
            'jumlah_pasien_rawat_jalan_rad',
            'jumlah_pasien_rawat_jalan_ll'
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

export const deleteDataRLTigaTitikLimaBelas = async(req, res) => {
    try {
        const count = await rlTigaTitikLimaBelasDetail.destroy({
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