import { Sequelize } from "sequelize";
import { jenisGolonganSebabPenyakit } from "../models/JenisGolonganSebabPenyakit.js";
const Op = Sequelize.Op


export const getDataJenisGolPenyakit = (req, res) => {
  jenisGolonganSebabPenyakit
    .findAll({
      attributes: ["id", "no", "gender","no_dtd", "no_daftar_terperinci", "nama"],
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
}

export const getDataJenisGolonganPenyakitB = (req, res) => {
  jenisGolonganSebabPenyakit.findAll({
        attributes: ["id", "no", "gender","no_dtd", "no_daftar_terperinci", "nama"],
        where:{
          rl_id: 20,
          [Op.or]: {
            nama:{
              [Op.like] : '%'+req.query.search+'%'
            }, 
            no_daftar_terperinci : {
                  [Op.like] : '%'+req.query.search+'%'
                }
          }
        }
      }).then((results) => {
        res.status(200).send({
          status: true,
          message: "data found",
          data: results
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
}

export const getDataJenisGolonganPenyakitBId = (req, res) => {
  jenisGolonganSebabPenyakit.findOne({
        attributes: ["id", "no", "gender","no_dtd", "no_daftar_terperinci", "nama"],
        where:{
          id: req.query.id
        }
      }).then((results) => {
        res.status(200).send({
          status: true,
          message: "data found",
          data: [results]
        });
      })
      .catch((err) => {
        res.status(422).send({
          status: false,
          message: err,
        });
        return;
      });
}