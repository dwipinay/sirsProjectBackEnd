import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikDuaHeader,
  rlTigaTitikDuaDetail,
  jenisPelayanan,
} from "../models/RLTigaTitikDua.js";
import Joi from "joi";

export const getDataRLTigaTitikDua = (req, res) => {
  rlTigaTitikDuaHeader
    .findAll({
      attributes: ["id", "tahun"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlTigaTitikDuaDetail,
        include: {
          model: jenisPelayanan,
        },
      },
      order: [[{ model: rlTigaTitikDuaDetail }, "jenis_pelayanan_id", "ASC"]],
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const insertDataRLTigaTitikDua = async (req, res) => {
    //console.log(req.body)
  const schema = Joi.object({
    tahun: Joi.number().required(),
    data: Joi.array()
      .items(
        Joi.object()
          .keys({
            jenisPelayananId: Joi.number().required(),
            totalPasienRujukan: Joi.number().required(),
            totalPasienNonRujukan: Joi.number().required(),
            tindakLanjutPelayananDirawat: Joi.number().required(),
            tindakLanjutPelayananDirujuk: Joi.number().required(),
            // tindakLanjutPelayananPulang: Joi.number().required(),
            matiDiUGD: Joi.number().required(),
            doa: Joi.number().required(),
          })
          .required()
      )
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }

  let transaction;
  try {
    transaction = await databaseSIRS.transaction();
    const resultInsertHeader = await rlTigaTitikDuaHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction }
    );

    let total;
    let totaltindakan;
    const dataDetail = req.body.data.map((value, index) => {
      total = value.totalPasienNonRujukan + value.totalPasienNonRujukan;
      totaltindakan =
        value.tindakLanjutPelayananDirawat +
        value.tindakLanjutPelayananDirujuk +
        value.matiDiUGD +
        value.doa;
      let jumlahPelayananPulang = total - totaltindakan;
      return {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        rl_tiga_titik_dua_id: resultInsertHeader.id,
        jenis_pelayanan_id: value.jenisPelayananId,
        total_pasien_rujukan: value.totalPasienRujukan,
        total_pasien_non_rujukan: value.totalPasienNonRujukan,
        tindak_lanjut_pelayanan_dirawat: value.tindakLanjutPelayananDirawat,
        tindak_lanjut_pelayanan_dirujuk: value.tindakLanjutPelayananDirujuk,
        tindak_lanjut_pelayanan_pulang: jumlahPelayananPulang,
        mati_di_ugd: value.matiDiUGD,
        doa: value.doa,
        user_id: req.user.id,
      };
    });

    if (total >= totaltindakan) {
      const resultInsertDetail = await rlTigaTitikDuaDetail.bulkCreate(
        dataDetail,
        {
          transaction,
          updateOnDuplicate: [
            "total_pasien_rujukan",
            "total_pasien_non_rujukan",
            "tindak_lanjut_pelayanan_dirawat",
            "tindak_lanjut_pelayanan_dirujuk",
            "tindak_lanjut_pelayanan_pulang",
            "mati_di_ugd",
            "doa",
          ],
        }
      );

      await transaction.commit();
      res.status(201).send({
        status: true,
        message: "data created",
        data: {
          id: resultInsertHeader.id,
        },
      });
    } else {
      res.status(400).send({
        status: false,
        message: "Jumlah Tindak Lanjut Pelayanan Pulang Tidak Sesuai",
      });
    }
  } catch (error) {
    console.log(error);
    if (transaction) {
      await transaction.rollback();
    }
  }
};

export const deleteDataRLTigaTitikDua = async (req, res) => {
  try {
    const count = await rlTigaTitikDuaDetail.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).send({
      status: true,
      message: "data deleted successfully",
      data: {
        deleted_rows: count,
      },
    });
  } catch (error) {
    res.status(404).send({
      status: false,
      message: error,
    });
  }
};

export const getDataRLTigaTitikDuaDetail = (req, res) => {
  rlTigaTitikDuaDetail
    .findAll({
      attributes: [
        "id",
        "rl_tiga_titik_dua_id",
        "user_id",
        "jenis_pelayanan_id",
        "total_pasien_rujukan",
        "total_pasien_non_rujukan",
        "tindak_lanjut_pelayanan_dirawat",
        "tindak_lanjut_pelayanan_dirujuk",
        "tindak_lanjut_pelayanan_pulang",
        "mati_di_ugd",
        "doa",
      ],
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisPelayanan,
        attributes: ["nama"],
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const getRLTigaTitikDuaById = async (req, res) => {
  rlTigaTitikDuaDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: jenisPelayanan,
        // include: {
        //     model: jenisKegiatan
        // }
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
      });
    })
    .catch((err) => {
      res.status(422).send({
        status: false,
        message: err,
      });
      return;
    });
};

export const updateDataRLTigaTitikDua = async (req, res) => {
    
    try {
    
    const data = req.body;
    let total = data.totalPasienNonRujukan + data.totalPasienNonRujukan;
    let totaltindakan =
    data.tindakLanjutPelayananDirawat +
    data.tindakLanjutPelayananDirujuk +
    data.matiDiUGD +
    data.doa;
    let jumlahPelayananPulang = total - totaltindakan;
    const dataUPdate = {
        total_pasien_rujukan: data.totalPasienRujukan,
        total_pasien_non_rujukan: data.totalPasienNonRujukan,
        tindak_lanjut_pelayanan_dirawat: data.tindakLanjutPelayananDirawat,
        tindak_lanjut_pelayanan_dirujuk: data.tindakLanjutPelayananDirujuk,
        tindak_lanjut_pelayanan_pulang: jumlahPelayananPulang,
        mati_di_ugd: data.matiDiUGD,
        doa: data.doa,
    };
    
      if (total >= totaltindakan) {
        const update = await rlTigaTitikDuaDetail.update(dataUPdate, {
          where: {
            id: req.params.id,
          },
        });
        res.status(201).send({
          status: true,
          message: "Data Diperbaharui",
        });
      } else {
        res.status(400).send({
          status: false,
          message: "Jumlah Tindak Lanjut Pelayanan Pulang Tidak Sesuai",
        });
      }
  } catch (error) {
    console.log(error.message);
    res.status(400).send({
      status: false,
      message: "Gagal Memperbaharui Data",
    });
  }
};