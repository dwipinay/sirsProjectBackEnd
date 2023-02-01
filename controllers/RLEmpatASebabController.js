import { databaseSIRS } from "../config/Database.js";
import {
  rlEmpatASebabHeader,
  rlEmpatASebabDetail,
  jenisGolSebabPenyakitId,
} from "../models/RLEmpatASebab.js";
import Joi from "joi";
import { jenisGolSebabPenyakit } from "../models/JenisGolSebabPenyakit.js";

export const getDataRLEmpatASebab = (req, res) => {
  rlEmpatASebabHeader
    .findAll({
      attributes: ["id", "tahun"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlEmpatASebabDetail,
        include: {
          model: jenisGolSebabPenyakitId,
        },
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

export const getDataRLEmpatASebabById = (req, res) => {
  rlEmpatASebabDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisGolSebabPenyakit,
        attributes: ["no", "no_dtd", "nama"],
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

export const insertDataRLEmpatASebab = async (req, res) => {
  const schema = Joi.object({
    tahun: Joi.number().required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          jenisGolSebabPenyakitId: Joi.number(),
          jmlhPasHidupMatiUmurSex6hrL: Joi.number(),
          jmlhPasHidupMatiUmurSex6hrP: Joi.number(),
          jmlhPasHidupMatiUmurSex28hrL: Joi.number(),
          jmlhPasHidupMatiUmurSex28hrP: Joi.number(),
          jmlhPasHidupMatiUmurSex28hr1thL: Joi.number(),
          jmlhPasHidupMatiUmurSex28hr1thP: Joi.number(),
          jmlhPasHidupMatiUmurSex14thL: Joi.number(),
          jmlhPasHidupMatiUmurSex14thP: Joi.number(),
          jmlhPasHidupMatiUmurSex414thL: Joi.number(),
          jmlhPasHidupMatiUmurSex414thP: Joi.number(),
          jmlhPasHidupMatiUmurSex1424thL: Joi.number(),
          jmlhPasHidupMatiUmurSex1424thP: Joi.number(),
          jmlhPasHidupMatiUmurSex2444thL: Joi.number(),
          jmlhPasHidupMatiUmurSex2444thP: Joi.number(),
          jmlhPasHidupMatiUmurSex4464thL: Joi.number(),
          jmlhPasHidupMatiUmurSex4464thP: Joi.number(),
          jmlhPasHidupMatiUmurSexLebih64thL: Joi.number(),
          jmlhPasHidupMatiUmurSexLebih64thP: Joi.number(),
          jmlhPasKeluarHidupMatiLP: Joi.number(),
          jmlhPasKeluarHidupMatiSexL: Joi.number(),
          jmlhPasKeluarHidupMatiSexP: Joi.number(),
          jmlhPasKeluarMati: Joi.number(),
        })
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
    const resultInsertHeader = await rlEmpatASebabHeader.create(
      {
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        user_id: req.user.id,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      let jumlahL =
        value.jmlhPasHidupMatiUmurSex6hrL +
        value.jmlhPasHidupMatiUmurSex28hrL +
        value.jmlhPasHidupMatiUmurSex28hr1thL +
        value.jmlhPasHidupMatiUmurSex14thL +
        value.jmlhPasHidupMatiUmurSex414thL +
        value.jmlhPasHidupMatiUmurSex1424thL +
        value.jmlhPasHidupMatiUmurSex2444thL +
        value.jmlhPasHidupMatiUmurSex4464thL +
        value.jmlhPasHidupMatiUmurSexLebih64thL;

      let jumlahP =
        value.jmlhPasHidupMatiUmurSex6hrP +
        value.jmlhPasHidupMatiUmurSex28hrP +
        value.jmlhPasHidupMatiUmurSex28hr1thP +
        value.jmlhPasHidupMatiUmurSex14thP +
        value.jmlhPasHidupMatiUmurSex414thP +
        value.jmlhPasHidupMatiUmurSex1424thP +
        value.jmlhPasHidupMatiUmurSex2444thP +
        value.jmlhPasHidupMatiUmurSex4464thP +
        value.jmlhPasHidupMatiUmurSexLebih64thP;

      let jumlahall = jumlahL + jumlahP;
      return {
        rl_empat_a_sebab_id: resultInsertHeader.id,
        rs_id: req.user.rsId,
        tahun: req.body.tahun,
        jenis_gol_sebab_penyakit_id: value.jenisGolSebabPenyakitId,
        jmlh_pas_hidup_mati_umur_sex_0_6hr_l: value.jmlhPasHidupMatiUmurSex6hrL,
        jmlh_pas_hidup_mati_umur_sex_0_6hr_p: value.jmlhPasHidupMatiUmurSex6hrP,
        jmlh_pas_hidup_mati_umur_sex_6_28hr_l:
          value.jmlhPasHidupMatiUmurSex28hrL,
        jmlh_pas_hidup_mati_umur_sex_6_28hr_p:
          value.jmlhPasHidupMatiUmurSex28hrP,
        jmlh_pas_hidup_mati_umur_sex_28hr_1th_l:
          value.jmlhPasHidupMatiUmurSex28hr1thL,
        jmlh_pas_hidup_mati_umur_sex_28hr_1th_p:
          value.jmlhPasHidupMatiUmurSex28hr1thP,
        jmlh_pas_hidup_mati_umur_sex_1_4th_l:
          value.jmlhPasHidupMatiUmurSex14thL,
        jmlh_pas_hidup_mati_umur_sex_1_4th_p:
          value.jmlhPasHidupMatiUmurSex14thP,
        jmlh_pas_hidup_mati_umur_sex_4_14th_l:
          value.jmlhPasHidupMatiUmurSex414thL,
        jmlh_pas_hidup_mati_umur_sex_4_14th_p:
          value.jmlhPasHidupMatiUmurSex414thP,
        jmlh_pas_hidup_mati_umur_sex_14_24th_l:
          value.jmlhPasHidupMatiUmurSex1424thL,
        jmlh_pas_hidup_mati_umur_sex_14_24th_p:
          value.jmlhPasHidupMatiUmurSex1424thP,
        jmlh_pas_hidup_mati_umur_sex_24_44th_l:
          value.jmlhPasHidupMatiUmurSex2444thL,
        jmlh_pas_hidup_mati_umur_sex_24_44th_p:
          value.jmlhPasHidupMatiUmurSex2444thP,
        jmlh_pas_hidup_mati_umur_sex_44_64th_l:
          value.jmlhPasHidupMatiUmurSex4464thL,
        jmlh_pas_hidup_mati_umur_sex_44_64th_p:
          value.jmlhPasHidupMatiUmurSex4464thP,
        jmlh_pas_hidup_mati_umur_sex_lebih_64th_l:
          value.jmlhPasHidupMatiUmurSexLebih64thL,
        jmlh_pas_hidup_mati_umur_sex_lebih_64th_p:
          value.jmlhPasHidupMatiUmurSexLebih64thP,
        jmlh_pas_keluar_hidup_mati_sex_l: jumlahL,
        jmlh_pas_keluar_hidup_mati_sex_p: jumlahP,
        jmlh_pas_keluar_hidup_mati_lp: jumlahall,
        jmlh_pas_keluar_mati: value.jmlhPasKeluarMati,
        user_id: req.user.id,
      };
    });

    if (
      dataDetail[0].jmlh_pas_keluar_mati <=
      dataDetail[0].jmlh_pas_keluar_hidup_mati_lp
    ) {
      const resultInsertDetail = await rlEmpatASebabDetail.bulkCreate(
        dataDetail,
        {
          transaction,
          updateOnDuplicate: [
            "jmlh_pas_hidup_mati_umur_sex_0_6hr_l",
            "jmlh_pas_hidup_mati_umur_sex_0_6hr_p",
            "jmlh_pas_hidup_mati_umur_sex_6_28hr_l",
            "jmlh_pas_hidup_mati_umur_sex_6_28hr_p",
            "jmlh_pas_hidup_mati_umur_sex_28hr_1th_l",
            "jmlh_pas_hidup_mati_umur_sex_28hr_1th_p",
            "jmlh_pas_hidup_mati_umur_sex_1_4th_l",
            "jmlh_pas_hidup_mati_umur_sex_1_4th_p",
            "jmlh_pas_hidup_mati_umur_sex_4_14th_l",
            "jmlh_pas_hidup_mati_umur_sex_4_14th_p",
            "jmlh_pas_hidup_mati_umur_sex_14_24th_l",
            "jmlh_pas_hidup_mati_umur_sex_14_24th_p",
            "jmlh_pas_hidup_mati_umur_sex_24_44th_l",
            "jmlh_pas_hidup_mati_umur_sex_24_44th_p",
            "jmlh_pas_hidup_mati_umur_sex_44_64th_l",
            "jmlh_pas_hidup_mati_umur_sex_44_64th_p",
            "jmlh_pas_hidup_mati_umur_sex_lebih_64th_l",
            "jmlh_pas_hidup_mati_umur_sex_lebih_64th_p",
            "jmlh_pas_keluar_hidup_mati_sex_l",
            "jmlh_pas_keluar_hidup_mati_sex_p",
            "jmlh_pas_keluar_hidup_mati_lp",
            "jmlh_pas_keluar_mati",
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
        message: "Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
      });
    }
  } catch (error) {
    console.log(error);
    if (transaction) {
      await transaction.rollback();
    }
  }
};

export const updateDataRLEmpatASebab = async (req, res) => {
  const schema = Joi.object({
    par6hrL: Joi.number().min(0),
    par6hrP: Joi.number().min(0),
    par14thL: Joi.number().min(0),
    par14thP: Joi.number().min(0),
    par28hr1thL: Joi.number().min(0),
    par28hr1thP: Joi.number().min(0),
    par28hrL: Joi.number().min(0),
    par28hrP: Joi.number().min(0),
    par414thL: Joi.number().min(0),
    par414thP: Joi.number().min(0),
    par1424thL: Joi.number().min(0),
    par1424thP: Joi.number().min(0),
    par2444thL: Joi.number().min(0),
    par2444thP: Joi.number().min(0),
    par4464thL: Joi.number().min(0),
    par4464thP: Joi.number().min(0),
    parLebih64thL: Joi.number().min(0),
    parLebih64thP: Joi.number().min(0),
    jmlhPasKeluarMati: Joi.number().min(0),
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(404).send({
      status: false,
      message: error.details[0].message,
    });
    return;
  }
  try {
    let jumlahL =
      req.body.par6hrL +
      req.body.par14thL +
      req.body.par28hr1thL +
      req.body.par28hrL +
      req.body.par414thL +
      req.body.par1424thL +
      req.body.par2444thL +
      req.body.par4464thL +
      req.body.parLebih64thL;

    let jumlahP =
      req.body.par6hrP +
      req.body.par14thP +
      req.body.par28hr1thP +
      req.body.par28hrP +
      req.body.par414thP +
      req.body.par1424thP +
      req.body.par2444thP +
      req.body.par4464thP +
      req.body.parLebih64thP;

    let jumlahall = jumlahL + jumlahP;
    const dataUpdate = {
      jmlh_pas_hidup_mati_umur_sex_0_6hr_l: req.body.par6hrL,
      jmlh_pas_hidup_mati_umur_sex_0_6hr_p: req.body.par6hrP,
      jmlh_pas_hidup_mati_umur_sex_6_28hr_l: req.body.par28hrL,
      jmlh_pas_hidup_mati_umur_sex_6_28hr_p: req.body.par28hrP,
      jmlh_pas_hidup_mati_umur_sex_28hr_1th_l: req.body.par28hr1thL,
      jmlh_pas_hidup_mati_umur_sex_28hr_1th_p: req.body.par28hr1thP,
      jmlh_pas_hidup_mati_umur_sex_1_4th_l: req.body.par14thL,
      jmlh_pas_hidup_mati_umur_sex_1_4th_p: req.body.par14thP,
      jmlh_pas_hidup_mati_umur_sex_4_14th_l: req.body.par414thL,
      jmlh_pas_hidup_mati_umur_sex_4_14th_p: req.body.par414thP,
      jmlh_pas_hidup_mati_umur_sex_14_24th_l: req.body.par1424thL,
      jmlh_pas_hidup_mati_umur_sex_14_24th_p: req.body.par1424thP,
      jmlh_pas_hidup_mati_umur_sex_24_44th_l: req.body.par2444thL,
      jmlh_pas_hidup_mati_umur_sex_24_44th_p: req.body.par2444thP,
      jmlh_pas_hidup_mati_umur_sex_44_64th_l: req.body.par4464thL,
      jmlh_pas_hidup_mati_umur_sex_44_64th_p: req.body.par4464thP,
      jmlh_pas_hidup_mati_umur_sex_lebih_64th_l: req.body.parLebih64thL,
      jmlh_pas_hidup_mati_umur_sex_lebih_64th_p: req.body.parLebih64thP,
      jmlh_pas_keluar_hidup_mati_sex_l: jumlahL,
      jmlh_pas_keluar_hidup_mati_sex_p: jumlahP,
      jmlh_pas_keluar_hidup_mati_lp: jumlahall,
      jmlh_pas_keluar_mati: req.body.jmlhPasKeluarMati,
    };

    if (
      dataUpdate.jmlh_pas_keluar_mati <=
      dataUpdate.jmlh_pas_keluar_hidup_mati_lp
    ) {
      await rlEmpatASebabDetail.update(dataUpdate, {
        where: {
          id: req.params.id,
        },
      });
      res.status(200).json({ message: "RL 4a Sebab Updated" });
    } else {
      res.status(400).send({
        status: false,
        message: "Data Jumlah Pasien Mati Lebih Dari Jumlah Pasien Hidup/Mati",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataRLEmpatASebab = async (req, res) => {
  try {
    const count = await rlEmpatASebabDetail.destroy({
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
