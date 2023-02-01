import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";
import {
  groupJenisKegiatan,
  groupJenisKegiatanHeader,
  jenisKegiatan,
} from "./JenisKegiatan.js";

export const rlTigaTitikDelapan = databaseSIRS.define("rl_tiga_titik_delapan", {
  rs_id: {
    type: DataTypes.STRING,
  },
  tahun: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.STRING,
  },
});

export const rlTigaTitikDelapanDetail = databaseSIRS.define(
  "rl_tiga_titik_delapan_detail",
  {
    rl_tiga_titik_delapan_id: {
      type: DataTypes.INTEGER,
    },
    rs_id: {
      type: DataTypes.STRING,
    },
    tahun: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    jenis_kegiatan_id: {
      type: DataTypes.INTEGER,
    },
    jumlah: {
      type: DataTypes.INTEGER,
    },
  }
);

rlTigaTitikDelapan.hasMany(rlTigaTitikDelapanDetail, {
  foreignKey: "rl_tiga_titik_delapan_id",
});

rlTigaTitikDelapanDetail.belongsTo(rlTigaTitikDelapan, {
  foreignKey: "id",
});

jenisKegiatan.hasMany(rlTigaTitikDelapanDetail, {
  foreignKey: "id",
});

rlTigaTitikDelapanDetail.belongsTo(jenisKegiatan, {
  foreignKey: "jenis_kegiatan_id",
});

groupJenisKegiatan.hasMany(jenisKegiatan, {
  foreignKey: "id",
});

jenisKegiatan.belongsTo(groupJenisKegiatan, {
  foreignKey: "group_jenis_kegiatan_id",
});

groupJenisKegiatanHeader.hasMany(groupJenisKegiatan, {
  foreignKey: "id",
});

groupJenisKegiatan.belongsTo(groupJenisKegiatanHeader, {
  foreignKey: "group_jenis_kegiatan_header_id",
});
