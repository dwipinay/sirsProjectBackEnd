import { databaseSIRS } from "../config/Database.js";
import { rlEmpatBSebabHeader, rlEmpatBSebabDetail, rlEmpatJenisGolPenyakit } from "../models/RLEmpatBSebab.js";
import joi from "joi";

export const insertDataRLEmpatBSebab = async(req, res) => {
    const schema = joi.object({
        tahun: joi.number().required(),
        data: joi.array()
            .items(
                joi.object().keys({
                    jenisGolSebabId: joi.number(),
                    jmlhPasKasusUmurSex0hr6hrL: joi.number().min(0),
                    jmlhPasKasusUmurSex0hr6hrP: joi.number().min(0),
                    jmlhPasKasusUmurSex6hr28hrL: joi.number().min(0),
                    jmlhPasKasusUmurSex6hr28hrP: joi.number().min(0),
                    jmlhPasKasusUmurSex28hr1thL: joi.number().min(0),
                    jmlhPasKasusUmurSex28hr1thP: joi.number().min(0),
                    jmlhPasKasusUmurSex1th4thL: joi.number().min(0),
                    jmlhPasKasusUmurSex1th4thP: joi.number().min(0),
                    jmlhPasKasusUmurSex4th14thL: joi.number().min(0),
                    jmlhPasKasusUmurSex4th14thP: joi.number().min(0),
                    jmlhPasKasusUmurSex14th24thL: joi.number().min(0),
                    jmlhPasKasusUmurSex14th24thP: joi.number().min(0),
                    jmlhPasKasusUmurSex24th44thL: joi.number().min(0),
                    jmlhPasKasusUmurSex24th44thP: joi.number().min(0),
                    jmlhPasKasusUmurSex44th64L: joi.number().min(0),
                    jmlhPasKasusUmurSex44th64P: joi.number().min(0),
                    jmlhPasKasusUmurSexLebih64L: joi.number().min(0),
                    jmlhPasKasusUmurSexLebih64P: joi.number().min(0),
                    kasusBaruL: joi.number().min(0),
                    kasusBaruP: joi.number().min(0),
                    jmlhKasusBaru: joi.number().min(0),
                    jmlhKunjungan: joi.number().min(0)
                })
            ).required()
    })

    const { error, value } = schema.validate(req.body)
    if(error){
        res.status(404).send({
            status: false,
            message: error.details[0].message
        })
        return
    }

    let transaction

    try {
        transaction = await databaseSIRS.transaction()
        const resultInsertHeader = await rlEmpatBSebabHeader.create({
            rs_id: req.user.rsId,
            tahun: req.body.tahun,
            user_id: req.user.id
        }, { transaction })

        const dataDetail = req.body.data.map((value, index) => {
            let jumlahL = value.jmlhPasKasusUmurSex0hr6hrL + value.jmlhPasKasusUmurSex6hr28hrL + value.jmlhPasKasusUmurSex28hr1thL + value.jmlhPasKasusUmurSex1th4thL + value.jmlhPasKasusUmurSex4th14thL + value.jmlhPasKasusUmurSex14th24thL + value.jmlhPasKasusUmurSex24th44thL + value.jmlhPasKasusUmurSex44th64L + value.jmlhPasKasusUmurSexLebih64L

            let jumlahP = value.jmlhPasKasusUmurSex0hr6hrP + value.jmlhPasKasusUmurSex6hr28hrP + value.jmlhPasKasusUmurSex28hr1thP + value.jmlhPasKasusUmurSex1th4thP + value.jmlhPasKasusUmurSex4th14thP + value.jmlhPasKasusUmurSex14th24thP + value.jmlhPasKasusUmurSex24th44thP + value.jmlhPasKasusUmurSex44th64P + value.jmlhPasKasusUmurSexLebih64P

            let jumlahall = jumlahL + jumlahP

            return {
                rl_empat_b_sebab_id: resultInsertHeader.id,
                rs_id: req.user.rsId,
                tahun: req.body.tahun,
                jenis_golongan_sebab_penyakit_id: value.jenisGolSebabId,
                jmlh_pas_kasus_umur_sex_0_6hr_l: value.jmlhPasKasusUmurSex0hr6hrL,
                jmlh_pas_kasus_umur_sex_0_6hr_p: value.jmlhPasKasusUmurSex0hr6hrP,
                jmlh_pas_kasus_umur_sex_6_28hr_l: value.jmlhPasKasusUmurSex6hr28hrL,
                jmlh_pas_kasus_umur_sex_6_28hr_p: value.jmlhPasKasusUmurSex6hr28hrP,
                jmlh_pas_kasus_umur_sex_28hr_1th_l: value.jmlhPasKasusUmurSex28hr1thL,
                jmlh_pas_kasus_umur_sex_28hr_1th_p: value.jmlhPasKasusUmurSex28hr1thP,
                jmlh_pas_kasus_umur_sex_1_4th_l: value.jmlhPasKasusUmurSex1th4thL,
                jmlh_pas_kasus_umur_sex_1_4th_p: value.jmlhPasKasusUmurSex1th4thP,
                jmlh_pas_kasus_umur_sex_4_14th_l: value.jmlhPasKasusUmurSex4th14thL,
                jmlh_pas_kasus_umur_sex_4_14th_p: value.jmlhPasKasusUmurSex4th14thP,
                jmlh_pas_kasus_umur_sex_14_24th_l: value.jmlhPasKasusUmurSex14th24thL,
                jmlh_pas_kasus_umur_sex_14_24th_p: value.jmlhPasKasusUmurSex14th24thP,
                jmlh_pas_kasus_umur_sex_24_44th_l: value.jmlhPasKasusUmurSex24th44thL,
                jmlh_pas_kasus_umur_sex_24_44th_p: value.jmlhPasKasusUmurSex24th44thP,
                jmlh_pas_kasus_umur_sex_44_64th_l: value.jmlhPasKasusUmurSex44th64L,
                jmlh_pas_kasus_umur_sex_44_64th_p: value.jmlhPasKasusUmurSex44th64P,
                jmlh_pas_kasus_umur_sex_lebih_64th_l: value.jmlhPasKasusUmurSexLebih64L,
                jmlh_pas_kasus_umur_sex_lebih_64th_p: value.jmlhPasKasusUmurSexLebih64P,
                kasus_baru_l: jumlahL,
                kasus_baru_p: jumlahP,
                jumlah_kasus_baru: jumlahall,
                jumlah_kunjungan: value.jmlhKunjungan,
                user_id: req.user.id
            }
        })

        if (dataDetail[0].jumlah_kunjungan >= dataDetail[0].jumlah_kasus_baru ) {
                const resultInsertDetail = await rlEmpatBSebabDetail.bulkCreate(dataDetail, { 
                    transaction,
                    updateOnDuplicate: [
                        'jmlh_pas_kasus_umur_sex_0_6hr_l',
                        'jmlh_pas_kasus_umur_sex_0_6hr_p',
                        'jmlh_pas_kasus_umur_sex_6_28hr_l',
                        'jmlh_pas_kasus_umur_sex_6_28hr_p',
                        'jmlh_pas_kasus_umur_sex_28hr_1th_l',
                        'jmlh_pas_kasus_umur_sex_28hr_1th_p',
                        'jmlh_pas_kasus_umur_sex_1_4th_l',
                        'jmlh_pas_kasus_umur_sex_1_4th_p',
                        'jmlh_pas_kasus_umur_sex_4_14th_l',
                        'jmlh_pas_kasus_umur_sex_4_14th_p',
                        'jmlh_pas_kasus_umur_sex_14_24th_l',
                        'jmlh_pas_kasus_umur_sex_14_24th_p',
                        'jmlh_pas_kasus_umur_sex_24_44th_l',
                        'jmlh_pas_kasus_umur_sex_24_44th_p',
                        'jmlh_pas_kasus_umur_sex_44_64th_l',
                        'jmlh_pas_kasus_umur_sex_44_64th_p',
                        'jmlh_pas_kasus_umur_sex_lebih_64th_l',
                        'jmlh_pas_kasus_umur_sex_lebih_64th_p',
                        'kasus_baru_l',
                        'kasus_baru_p',
                        'jumlah_kasus_baru',
                        'jumlah_kunjungan'
                    ] })
                await transaction.commit()
                res.status(201).send({
                    status: true,
                    message: "Data Created",
                    data: {
                        id:resultInsertHeader.id
                    }
                })
        } else {
            res.status(400).send({
            status: false,
            message: "Data Jumlah Kunjungan kurang dari jumlah kasus baru"
            })
        }
    }
    catch (error) {
        console.log(error)
        if(transaction){
            await transaction.rollback()
        }
    }
}

export const getDataRLEmpatBSebab = (req, res) => {
    rlEmpatBSebabHeader.findAll({
        attributes: ['rs_id', 'tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include: {
            model: rlEmpatBSebabDetail,
            include: {
                model: rlEmpatJenisGolPenyakit,
                attributes: ['no_dtd', 'no_daftar_terperinci', 'nama']
            }
        }, order: [
            [rlEmpatBSebabDetail, rlEmpatJenisGolPenyakit, 'no','ASC']
        ]
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

export const deleteDataRLEmpatBSebabId = async (req, res) => {
    try{
        await rlEmpatBSebabDetail.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).send({
            status: true,
            message: "Delete Data Success"
        })
    }catch (error) {
        console.log(error.message);
    }
}

export const getDataRLEmpatBSebabId = async (req, res) => {
    rlEmpatBSebabDetail.findOne({
        where: {
            id:req.params.id
        }, 
        include:{
            model: rlEmpatJenisGolPenyakit,
            attributes: ['no_dtd', 'no_daftar_terperinci', 'nama']
        }
    }) .then((results) => {
        res.status(200).send({
            status: true,
            message: "data found",
            data: results
        })
    }).catch((err) => {
        res.status(422).send({
            status: false,
            message: err
        })
        return
    })
} 

export const updateDataRLEmpatSebabId = async (req, res) => {
    try{
        const schema = joi.object({
            jmlhPasKasusUmurSex0hr6hrL: joi.number().min(0),
            jmlhPasKasusUmurSex0hr6hrP: joi.number().min(0),
            jmlhPasKasusUmurSex6hr28hrL: joi.number().min(0),
            jmlhPasKasusUmurSex6hr28hrP: joi.number().min(0),
            jmlhPasKasusUmurSex28hr1thL: joi.number().min(0),
            jmlhPasKasusUmurSex28hr1thP: joi.number().min(0),
            jmlhPasKasusUmurSex1th4thL: joi.number().min(0),
            jmlhPasKasusUmurSex1th4thP: joi.number().min(0),
            jmlhPasKasusUmurSex4th14thL: joi.number().min(0),
            jmlhPasKasusUmurSex4th14thP: joi.number().min(0),
            jmlhPasKasusUmurSex14th24thL: joi.number().min(0),
            jmlhPasKasusUmurSex14th24thP: joi.number().min(0),
            jmlhPasKasusUmurSex24th44thL: joi.number().min(0),
            jmlhPasKasusUmurSex24th44thP: joi.number().min(0),
            jmlhPasKasusUmurSex44th64L: joi.number().min(0),
            jmlhPasKasusUmurSex44th64P: joi.number().min(0),
            jmlhPasKasusUmurSexLebih64L: joi.number().min(0),
            jmlhPasKasusUmurSexLebih64P: joi.number().min(0),
            kasusBaruL: joi.number().min(0),
            kasusBaruP: joi.number().min(0),
            jmlhKunjungan: joi.number().min(0)
        })
        const { error, value } = schema.validate(req.body)
        if(error){
            res.status(404).send({
                status: false,
                message: error.details[0].message
            })
            return
        }

        try {
            // console.log(req.body.jmlhPasKasusUmurSex0hr6hrL)
            let jumlahL = req.body.jmlhPasKasusUmurSex0hr6hrL + req.body.jmlhPasKasusUmurSex6hr28hrL + req.body.jmlhPasKasusUmurSex28hr1thL + req.body.jmlhPasKasusUmurSex1th4thL + req.body.jmlhPasKasusUmurSex4th14thL + req.body.jmlhPasKasusUmurSex14th24thL + req.body.jmlhPasKasusUmurSex24th44thL + req.body.jmlhPasKasusUmurSex44th64L + req.body.jmlhPasKasusUmurSexLebih64L
            let jumlahP = req.body.jmlhPasKasusUmurSex0hr6hrP + req.body.jmlhPasKasusUmurSex6hr28hrP + req.body.jmlhPasKasusUmurSex28hr1thP + req.body.jmlhPasKasusUmurSex1th4thP + req.body.jmlhPasKasusUmurSex4th14thP + req.body.jmlhPasKasusUmurSex14th24thP + req.body.jmlhPasKasusUmurSex24th44thP + req.body.jmlhPasKasusUmurSex44th64P + req.body.jmlhPasKasusUmurSexLebih64P
            let jumlahall = jumlahL + jumlahP

            if (req.body.jmlhKunjungan >= jumlahall ) {
                const update = await rlEmpatBSebabDetail.update(
                    {
                        jmlh_pas_kasus_umur_sex_0_6hr_l: req.body.jmlhPasKasusUmurSex0hr6hrL,
                        jmlh_pas_kasus_umur_sex_0_6hr_p: req.body.jmlhPasKasusUmurSex0hr6hrP,
                        jmlh_pas_kasus_umur_sex_6_28hr_l: req.body.jmlhPasKasusUmurSex6hr28hrL,
                        jmlh_pas_kasus_umur_sex_6_28hr_p: req.body.jmlhPasKasusUmurSex6hr28hrP,
                        jmlh_pas_kasus_umur_sex_28hr_1th_l: req.body.jmlhPasKasusUmurSex28hr1thL,
                        jmlh_pas_kasus_umur_sex_28hr_1th_p: req.body.jmlhPasKasusUmurSex28hr1thP,
                        jmlh_pas_kasus_umur_sex_1_4th_l: req.body.jmlhPasKasusUmurSex1th4thL,
                        jmlh_pas_kasus_umur_sex_1_4th_p: req.body.jmlhPasKasusUmurSex1th4thP,
                        jmlh_pas_kasus_umur_sex_4_14th_l: req.body.jmlhPasKasusUmurSex4th14thL,
                        jmlh_pas_kasus_umur_sex_4_14th_p: req.body.jmlhPasKasusUmurSex4th14thP,
                        jmlh_pas_kasus_umur_sex_14_24th_l: req.body.jmlhPasKasusUmurSex14th24thL,
                        jmlh_pas_kasus_umur_sex_14_24th_p: req.body.jmlhPasKasusUmurSex14th24thP,
                        jmlh_pas_kasus_umur_sex_24_44th_l: req.body.jmlhPasKasusUmurSex24th44thL,
                        jmlh_pas_kasus_umur_sex_24_44th_p: req.body.jmlhPasKasusUmurSex24th44thP,
                        jmlh_pas_kasus_umur_sex_44_64th_l: req.body.jmlhPasKasusUmurSex44th64L,
                        jmlh_pas_kasus_umur_sex_44_64th_p: req.body.jmlhPasKasusUmurSex44th64P,
                        jmlh_pas_kasus_umur_sex_lebih_64th_l: req.body.jmlhPasKasusUmurSexLebih64L,
                        jmlh_pas_kasus_umur_sex_lebih_64th_p: req.body.jmlhPasKasusUmurSexLebih64P,
                        kasus_baru_l: jumlahL,
                        kasus_baru_p: jumlahP,
                        jumlah_kasus_baru: jumlahall,
                        jumlah_kunjungan: req.body.jmlhKunjungan,
                    }, {
                        where:{
                            id:req.params.id
                        }
                    }
                )         
                res.status(200).json({
                    status: true,
                    message: "Success Update Data"
                });
            } else {
                res.status(400).send({
                    status: false,
                    message: "Data Jumlah Kunjungan kurang dari jumlah kasus"
                })
            }
        } catch (error){
            res.status(400).send({
                status:false,
                message: "Update Data Fail"
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}