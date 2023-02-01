import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const rlEmpatASebabHeader = databaseSIRS.define("rl_empat_a_sebab", {
  rs_id: {
    type: DataTypes.STRING,
  },
  tahun: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
});

export const rlEmpatASebabDetail = databaseSIRS.define(
  "rl_empat_a_sebab_detail",
  {
    rl_empat_a_sebab_id: {
      type: DataTypes.INTEGER,
    },
    rs_id: {
      type: DataTypes.STRING,
    },
    tahun: {
      type: DataTypes.INTEGER,
    },
    jenis_gol_sebab_penyakit_id: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_0_6hr_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_0_6hr_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_6_28hr_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_6_28hr_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_28hr_1th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_28hr_1th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_1_4th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_1_4th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_4_14th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_4_14th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_14_24th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_14_24th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_24_44th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_24_44th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_44_64th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_44_64th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_lebih_64th_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_hidup_mati_umur_sex_lebih_64th_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_keluar_hidup_mati_sex_l: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_keluar_hidup_mati_sex_p: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_keluar_hidup_mati_lp: {
      type: DataTypes.INTEGER,
    },
    jmlh_pas_keluar_mati: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  }
);

export const jenisGolSebabPenyakitId = databaseSIRS.define(
  "jenis_gol_sebab_penyakit",
  {
    rl_id: {
      type: DataTypes.INTEGER,
    },
    no: {
      type: DataTypes.STRING,
    },
    no_dtd: {
      type: DataTypes.STRING,
    },
    no_daftar_terperinci: {
      type: DataTypes.STRING,
    },
    nama: {
      type: DataTypes.STRING,
    },
  }
);

rlEmpatASebabHeader.hasMany(rlEmpatASebabDetail, {
  foreignKey: "rl_empat_a_sebab_id",
});
rlEmpatASebabDetail.belongsTo(rlEmpatASebabHeader, {
  foreignKey: "id",
});

jenisGolSebabPenyakitId.hasMany(rlEmpatASebabDetail, {
  foreignKey: "id",
});
rlEmpatASebabDetail.belongsTo(jenisGolSebabPenyakitId, {
  foreignKey: "jenis_gol_sebab_penyakit_id",
});
