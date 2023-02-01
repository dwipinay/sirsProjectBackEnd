import { databaseSIRS } from '../config/Database.js'
import { rlTigaTitikSebelasHeader, rlTigaTitikSebelasDetail, jenisPelayanan } from '../models/RLTigaTitikSebelas.js'
import Joi from 'joi'

export const getDatarlTigaTitikSebelas = (req, res) => {
    rlTigaTitikSebelasHeader.findAll({
        attributes: ['id','tahun'],
        where:{
            rs_id: req.user.rsId,
            tahun: req.query.tahun
        },
        include:{
            model: rlTigaTitikSebelasDetail,
            include: {
                model: jenisPelayanan
            }
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

export const getDatarlTigaTitikSebelasDetail = (req, res) => {
    rlTigaTitikSebelasDetail.findAll({
        attributes: [
        'id',
        'rl_tiga_titik_sebelas_id',
        'user_id',
        'jenis_pelayanan_id',
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

export const getrlTigaTitikSebelasById = async(req,res)=>{
    rlTigaTitikSebelasDetail.findOne({
       
        where:{
            // rs_id: req.user.rsId,
            // tahun: req.query.tahun
            id:req.params.id
        },
        include:{
            model: jenisPelayanan
            // include: {
            //     model: jenisPelayanan
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

export const updateDatarlTigaTitikSebelas = async(req,res)=>{
    try{
        await rlTigaTitikSebelasDetail.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        console.log(req.body)
        res.status(200).json({message: "Rekapitulasi Laporan Telah Diperbaharui"});
    }catch(error){
        console.log(error.message);
    }
}
 
export const insertDataRLTigaTitikSebelas =  async (req, res) => {
    const schema = Joi.object({
        tahun: Joi.number().required(),
        data: Joi.array()
            .items(
                Joi.object().keys({
                    jenisPelayananId: Joi.number().required(),
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
    // console.log(req.user);
    let transaction
    try {
        transaction = await databaseSIRS.transaction()
        const resultInsertHeader = await rlTigaTitikSebelasHeader.create({
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
                rl_tiga_titik_sebelas_id: resultInsertHeader.id,
                jenis_pelayanan_id: value.jenisPelayananId,
                jumlah: value.jumlah,
                user_id: req.user.id 
            }
        })

        const resultInsertDetail = await rlTigaTitikSebelasDetail.bulkCreate(dataDetail, { 
            transaction, 
            updateOnDuplicate:['jumlah']
        })

        // console.log(resultInsertDetail[0].id)
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

export const deleteDataRLTigaTitikSebelas = async(req, res) => {
    try {
        const count = await rlTigaTitikSebelasDetail.destroy({
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