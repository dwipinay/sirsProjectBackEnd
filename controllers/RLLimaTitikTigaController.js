import { databaseSIRS } from "../config/Database.js";
import {
  rlLimaTitikTiga,
  rlLimaTitikTigaDetail,
  noUrut,
} from "../models/RLLimaTitikTiga.js";
import Joi from "joi";

export const getDataRLLimaTitikTiga = (req, res) => {
  rlLimaTitikTiga
    .findAll({
      attributes: ["id", "tahun"],

      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlLimaTitikTigaDetail,
        include: {
          model: noUrut,
        },
      },
      subQuery: false,
      limit: 10,
      offset: (1 - 1) * 10,
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

export const getDataRLLimaTitikTigaDetail = (req, res) => {
  rlLimaTitikTigaDetail
    .findAll({
      attributes: [
        "id",
        "rl_lima_titik_tiga_id",
        "user_id",
        "no_urut_id",
        "kode_icd_10",
        "deskripsi",
        "pasien_keluar_hidup_menurut_jeniskelamin_lk",
        "pasien_keluar_hidup_menurut_jeniskelamin_pr",
        "pasien_keluar_mati_menurut_jeniskelamin_lk",
        "pasien_keluar_mati_menurut_jeniskelamin_pr",
      ],
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

export const getRLLimaTitikTigaById = async (req, res) => {
  rlLimaTitikTigaDetail
    .findOne({
      where: {
        // rs_id: req.user.rsId,
        // tahun: req.query.tahun
        id: req.params.id,
      },
      include: {
        model: noUrut,
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

export const updateDataRLLimaTitikTiga = async (req, res) => {
  try {
    const dataUpdate = {
      kode_icd_10: req.body.kode_icd_10,
      deskripsi: req.body.deskripsi,
      pasien_keluar_hidup_menurut_jeniskelamin_lk: req.body.pasienKeluarHidupLK,
      pasien_keluar_hidup_menurut_jeniskelamin_pr: req.body.pasienKeluarHidupPR,
      pasien_keluar_mati_menurut_jeniskelamin_lk: req.body.pasienKeluarMatiLK,
      pasien_keluar_mati_menurut_jeniskelamin_pr: req.body.pasienKeluarMatiPR,
    };
    await rlLimaTitikTigaDetail.update(dataUpdate, {
      where: {
        id: req.params.id,
      },
    });
    //  console.log(res)
    res.status(200).json({ message: "RL Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataRLLimaTitikTiga = async (req, res) => {
  try {
    await rlLimaTitikTigaDetail.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: "RL Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

export const insertDataRLLimaTitikTiga = async (req, res) => {
  const schema = Joi.object({
    tahun: Joi.date().required(),
    tahunDanBulan: Joi.date().required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          noUrutId: Joi.number(),
          kodeIcd10: Joi.string(),
          deskripsi: Joi.string(),
          pasienKeluarHidupLK: Joi.number().min(0),
          pasienKeluarHidupPR: Joi.number().min(0),
          pasienKeluarMatiLK: Joi.number().min(0),
          pasienKeluarMatiPR: Joi.number().min(0),
        })
      )
      .required(),
  });
  //console.log(req);
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
    const resultInsertHeader = await rlLimaTitikTiga.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahunDanBulan,
        user_id: req.user.id,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      return {
        rl_lima_titik_tiga_id: resultInsertHeader.id,
        no_urut_id: value.noUrutId,
        kode_icd_10: value.kodeIcd10,
        deskripsi: value.deskripsi,
        pasien_keluar_hidup_menurut_jeniskelamin_lk: value.pasienKeluarHidupLK,
        pasien_keluar_hidup_menurut_jeniskelamin_pr: value.pasienKeluarHidupPR,
        pasien_keluar_mati_menurut_jeniskelamin_lk: value.pasienKeluarMatiLK,
        pasien_keluar_mati_menurut_jeniskelamin_pr: value.pasienKeluarMatiPR,
        rs_id: req.user.rsId,
        tahun: req.body.tahunDanBulan,
        user_id: req.user.id,
      };
    });

    const resultInsertDetail = await rlLimaTitikTigaDetail.bulkCreate(
      dataDetail,

      {
        transaction,
        updateOnDuplicate: [
          "pasien_keluar_hidup_menurut_jeniskelamin_lk",
          "pasien_keluar_hidup_menurut_jeniskelamin_pr",
          "pasien_keluar_mati_menurut_jeniskelamin_lk",
          "pasien_keluar_mati_menurut_jeniskelamin_pr",
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
  } catch (error) {
    console.log(error);
    if (transaction) {
      await transaction.rollback();
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).send({
          status: false,
          message: "Fail Duplicate Entry",
          // reason: 'Duplicate Entry'
        });
      } else {
        res.status(400).send({
          status: false,
          message: "error",
        });
      }
    }
  }
};
