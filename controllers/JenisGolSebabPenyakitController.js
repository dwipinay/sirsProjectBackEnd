import { jenisGolSebabPenyakit } from "../models/JenisGolSebabPenyakit.js";
import { or, Sequelize } from "sequelize";
const Op = Sequelize.Op;

export const getDataJenisGolSebabPenyakit = (req, res) => {
  jenisGolSebabPenyakit
    .findAll({
      attributes: ["id", "no", "no_dtd", "no_daftar_terperinci", "nama"],
      where: {
        rl_id: req.query.rlid,
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

export const getDataJenisGolSebabPenyakitA = (req, res) => {
  jenisGolSebabPenyakit
    .findAll({
      attributes: ["id", "no", "no_dtd", "no_daftar_terperinci", "nama"],
      where: {
        rl_id: 17,
        [Op.or]: {
          nama: {
            [Op.like]: "%" + req.query.search + "%",
          },
          no_daftar_terperinci: {
            [Op.like]: "%" + req.query.search + "%",
          },
        },
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
        // {
        //   "penyakit" : results,
        // }
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

export const getDataJenisGolSebabPenyakitASebab = (req, res) => {
  jenisGolSebabPenyakit
    .findAll({
      attributes: ["id", "no", "no_dtd", "no_daftar_terperinci", "nama"],
      where: {
        rl_id: 18,
        [Op.or]: {
          nama: {
            [Op.like]: "%" + req.query.search + "%",
          },
          no_daftar_terperinci: {
            [Op.like]: "%" + req.query.search + "%",
          },
        },
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: results,
        // {
        //   "penyakit" : results,
        // }
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

export const getDataJenisGolSebabPenyakitAbyId = (req, res) => {
  jenisGolSebabPenyakit
    .findOne({
      attributes: ["id", "no", "no_dtd", "no_daftar_terperinci", "nama"],
      where: {
        id: req.query.id,
      },
    })
    .then((results) => {
      res.status(200).send({
        status: true,
        message: "data found",
        data: [results],
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
