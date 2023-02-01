import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikSatuHeader, rlTigaTitikSatuDetail, jenisPelayanan } from '../models/RLTigaTitikSatu.js'
import Joi from 'joi'

export const getDataRLTigaTitikSatu = (req, res) => {
    rlTigaTitikSatuHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikSatuDetail,
            required: true,
            include: {
                model: jenisPelayanan
            }
        },
        // raw: true,
        // nest: true,
        order: [[{ model: rlTigaTitikSatuDetail }, 'jenis_pelayanan_id', 'ASC']]
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

export const getDataRLTigaTitikSatuDetail = (req, res) => {
    rlTigaTitikSatuDetail.findAll({
        attributes: ['id','rl_tiga_titik_satu_id'],
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

export const getDataRLTigaTitikSatuDetailById = async(req,res)=>{
    rlTigaTitikSatuDetail.findOne({
        where:{
            id:req.params.id
        },
        include:{
            model: jenisPelayanan
        }
    })
    .then((results) => {
        if (!results) {
            res.status(200).send({
                status: true,
                message: "data not found",
                data: results
            })
            return
        }
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

export const insertDataRLTigaTitikSatu =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisPelayananId: Joi.number().required(),
                    jumlahPasienAwalTahun: Joi.number().required(),
                    jumlahPasienMasuk: Joi.number().required(),
                    pasienKeluarHidup: Joi.number().required(),
                    kurangDari48Jam: Joi.number().required(),
                    lebihDariAtauSamaDengan48Jam: Joi.number().required(),
                    jumlahLamaDirawat: Joi.number().required(),
                    jumlahPasienAkhirTahun: Joi.number().required(),
                    jumlahHariPerawatan: Joi.number().required(),
                    kelasVVIP: Joi.number().required(),
                    kelasVIP: Joi.number().required(),
                    kelas1: Joi.number().required(),
                    kelas2: Joi.number().required(),
                    kelas3: Joi.number().required(),
                    kelasKhusus: Joi.number().required()
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
        await databaseSIRS.transaction(async function (transaction){
            const resultInsertHeader = await rlTigaTitikSatuHeader.create({
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
                    rl_tiga_titik_satu_id: resultInsertHeader.id,
                    jenis_pelayanan_id: value.jenisPelayananId,
                    jumlah_pasien_awal_tahun: value.jumlahPasienAwalTahun,
                    jumlah_pasien_masuk: value.jumlahPasienMasuk,
                    pasien_keluar_hidup: value.pasienKeluarHidup,
                    kurang_dari_48_Jam: value.kurangDari48Jam,
                    lebih_dari_atau_sama_dengan_48_jam: value.lebihDariAtauSamaDengan48Jam,
                    jumlah_lama_dirawat: value.jumlahLamaDirawat,
                    jumlah_pasien_akhir_tahun: value.jumlahPasienAkhirTahun,
                    jumlah_hari_perawatan: value.jumlahHariPerawatan,
                    kelas_VVIP: value.kelasVVIP,
                    kelas_VIP: value.kelasVIP,
                    kelas_1: value.kelas1,
                    kelas_2: value.kelas2,
                    kelas_3: value.kelas3,
                    kelas_khusus: value.kelasKhusus,
                    user_id: req.user.id
                }
            })

            await rlTigaTitikSatuDetail.bulkCreate(dataDetail, { 
                transaction,
                updateOnDuplicate: ['jumlah_pasien_awal_tahun', 'pasien_keluar_hidup', 
                    'jumlah_pasien_masuk', 'kurang_dari_48_Jam', 'lebih_dari_atau_sama_dengan_48_jam',
                    'jumlah_lama_dirawat', 'jumlah_pasien_akhir_tahun', 'jumlah_hari_perawatan', 'kelas_VVIP',
                    'kelas_VIP', 'kelas_1', 'kelas_2', 'kelas_3', 'kelas_khusus'
                ]
            })
            
            res.status(201).send({
                status: true,
                message: "data created",
                data: {
                    id: resultInsertHeader.id
                }
            })

            return resultInsertHeader
        })
    } catch (error) {
        console.log(error)
        
        res.status(400).send({
            status: false,
            message: "data not created",
            error: error
        })
    }
}

export const updateDataRLTigaTitikSatu = async(req,res)=>{
    try{
        const update = await rlTigaTitikSatuDetail.update(
            {
                jumlah_pasien_awal_tahun: req.body.jumlahPasienAwalTahun,
                jumlah_pasien_masuk: req.body.jumlahPasienMasuk,
                pasien_keluar_hidup: req.body.pasienKeluarHidup,
                kurang_dari_48_Jam: req.body.kurangDari48Jam,
                lebih_dari_atau_sama_dengan_48_jam: req.body.lebihDariAtauSamaDengan48Jam,
                jumlah_lama_dirawat: req.body.jumlahLamaDirawat,
                jumlah_pasien_akhir_tahun: req.body.jumlahPasienAkhirTahun,
                jumlah_hari_perawatan: req.body.jumlahHariPerawatan,
                kelas_VVIP: req.body.kelasVVIP,
                kelas_VIP:req.body.kelasVIP,
                kelas_1: req.body.kelas1,
                kelas_2: req.body.kelas2,
                kelas_3: req.body.kelas3,
                kelas_khusus:req.body.kelasKhusus,
                user_id: req.user.id
            },
            {
                where:{
                    id: req.params.id
            }
        });
        res.status(200).json({
            status: true,
            message: update
        });
    }catch(error){
        console.log(error.message);
    }
}

export const deleteDataRLTigaTitikSatu = async(req, res) => {
    try {
        const count = await rlTigaTitikSatuDetail.destroy({
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