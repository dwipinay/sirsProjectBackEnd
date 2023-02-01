import { databaseSIRS } from "../config/Database.js";
import {
  rlTigaTitikDelapan,
  rlTigaTitikDelapanDetail,
} from "../models/RLTigaTitikDelapan.js";
import Joi from "joi";
import {
  groupJenisKegiatan,
  groupJenisKegiatanHeader,
  jenisKegiatan,
} from "../models/JenisKegiatan.js";

export const getDataRLTigaTitikDelapan = (req, res) => {
  rlTigaTitikDelapan
    .findAll({
      attributes: ["id", "tahun"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: rlTigaTitikDelapanDetail,
        include: {
          model: jenisKegiatan,
        },
      },
      order: [[rlTigaTitikDelapanDetail, jenisKegiatan, "no", "ASC"]],
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

export const getDataRLTigaTitikDelapanDetailKegiatan = (req, res) => {
  rlTigaTitikDelapanDetail
    .findAll({
      attributes: ["id", "rl_tiga_titik_delapan_id", "jumlah"],
      where: {
        rs_id: req.user.rsId,
        tahun: req.query.tahun,
      },
      include: {
        model: jenisKegiatan,
        attributes: ["id", "no", "nama"],
        include: {
          model: groupJenisKegiatan,
          attributes: ["id", "no", "nama"],
          include: {
            model: groupJenisKegiatanHeader,
          },
        },
      },
      order: [[jenisKegiatan, "id", "ASC"]],
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

export const getDataRLTigaTitikDelapanById = (req, res) => {
  rlTigaTitikDelapanDetail
    .findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: jenisKegiatan,
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

export const getDataRLTigaTitikDelapanDetails = (req, res) => {
  rlTigaTitikDelapan
    .findAll({
      include: [{ model: rlTigaTitikDelapanDetail, include: [jenisKegiatan] }],
      attributes: ["id", "tahun"],
      where: {
        rs_id: req.user.rsId,
        user_id: req.user.id,
        tahun: req.param.tahun,
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

export const insertDataRLTigaTitikDelapan = async (req, res) => {
  const schema = Joi.object({
    tahun: Joi.number().required(),
    data: Joi.array()
      .items(
        Joi.object().keys({
          jenisKegiatanId: Joi.number().required(),
          jumlah: Joi.number().min(0),
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
    const rlInsertHeader = await rlTigaTitikDelapan.create(
      {
        rs_id: req.user.rsId,
        user_id: req.user.id,
        tahun: req.body.tahun,
      },
      { transaction }
    );

    const dataDetail = req.body.data.map((value, index) => {
      return {
        tahun: req.body.tahun,
        rs_id: req.user.rsId,
        rl_tiga_titik_delapan_id: rlInsertHeader.id,
        jenis_kegiatan_id: value.jenisKegiatanId,
        jumlah: value.jumlah,
        user_id: req.user.id,
      };
    });

    await rlTigaTitikDelapanDetail.bulkCreate(dataDetail, {
      transaction,
      updateOnDuplicate: ["jumlah"],
    });

    await transaction.commit();
    res.status(201).send({
      status: true,
      message: "data created",
      data: {
        id: rlInsertHeader.id,
      },
    });
  } catch (error) {
    console.log(error);
    if (transaction) {
      await transaction.rollback();
    }
  }
};

export const updateDataRLTigaTitikDelapan = async (req, res) => {
  try {
    await rlTigaTitikDelapanDetail.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "RL 3.8 Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteDataRLTigaTitikDelapan = async (req, res) => {
  try {
    const count = await rlTigaTitikDelapanDetail.destroy({
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
