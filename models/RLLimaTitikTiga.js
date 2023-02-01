import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from '../config/Database.js'
// import { noUrut } from "./NoUrut.js";

export const rlLimaTitikTiga = databaseSIRS.define(
    "rl_lima_titik_tiga",
    {
      rs_id: {
        type: DataTypes.STRING,
      },
      tahun: {
        type: DataTypes.DATEONLY,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
    //   created_at: {
    //     type: DataTypes.DATE,
    //   },
    //   modified_at: {
    //     type: DataTypes.DATE,
    //   },
    },
  );
  
  export const rlLimaTitikTigaDetail = databaseSIRS.define(
    "rl_lima_titik_tiga_detail",
    {
      rl_lima_titik_tiga_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      no_urut_id: {
        type: DataTypes.INTEGER,
      },
      kode_icd_10: {
        type: DataTypes.STRING,
        unique:true
      },
      deskripsi: {
        type: DataTypes.STRING,
      },
      pasien_keluar_hidup_menurut_jeniskelamin_lk: {
        type: DataTypes.INTEGER,
      },
      pasien_keluar_hidup_menurut_jeniskelamin_pr: {
        type: DataTypes.INTEGER,
      },
      pasien_keluar_mati_menurut_jeniskelamin_lk: {
        type: DataTypes.INTEGER,
      },
      pasien_keluar_mati_menurut_jeniskelamin_pr: {
        type: DataTypes.INTEGER,
      },
      tahun: {
        type: DataTypes.DATEONLY,
      },
      rs_id: {
        type: DataTypes.INTEGER,
      },
    //   created_at: {
    //     type: DataTypes.DATE,
    //   },
    //   modified_at: {
    //     type: DataTypes.DATE,
    //   },
    },
   
  );
  export const noUrut = databaseSIRS.define('no_urut', 
    {
        no: {
          type: DataTypes.NUMBER
      },
    }
    
)
export const icd10 = databaseSIRS.define('icd_10', 
    {
        code: {
          type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
    }
    }
)


rlLimaTitikTiga.hasMany(rlLimaTitikTigaDetail, {
    foreignKey:'rl_lima_titik_tiga_id'
})
rlLimaTitikTigaDetail.belongsTo(rlLimaTitikTiga, {
    foreignKey:'id'
})

noUrut.hasMany(rlLimaTitikTigaDetail, {
    foreignKey:'id'
})
rlLimaTitikTigaDetail.belongsTo(noUrut, {
    foreignKey:'no_urut_id'
})

icd10.hasMany(rlLimaTitikTigaDetail, {
  foreignKey:'id'
})
rlLimaTitikTigaDetail.belongsTo(icd10, {
  foreignKey:'kode_icd_10'
})