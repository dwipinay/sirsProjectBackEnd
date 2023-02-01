import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from '../config/Database.js'

export const rlTigaTitikTigaBelasA = databaseSIRS.define(
    "rl_tiga_titik_tiga_belas_a",
    {
      rs_id: {
        type: DataTypes.STRING,
      },
      tahun: {
        type: DataTypes.INTEGER,
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
  
  export const rlTigaTitikTigaBelasADetail = databaseSIRS.define(
    "rl_tiga_titik_tiga_belas_a_detail",
    {
      rl_tiga_titik_tiga_belas_a_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      golongan_obat_id: {
        type: DataTypes.INTEGER,
      },
      rawat_jalan: {
        type: DataTypes.INTEGER,
      },
      igd: {
        type: DataTypes.INTEGER,
      },
      rawat_inap: {
        type: DataTypes.INTEGER,
      },
      tahun: {
        type: DataTypes.INTEGER,
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
  export const golonganObat = databaseSIRS.define('golongan_obat', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no: {
          type: DataTypes.NUMBER
      },
    }
)


rlTigaTitikTigaBelasA.hasMany(rlTigaTitikTigaBelasADetail, {
    foreignKey:'rl_tiga_titik_tiga_belas_a_id'
})
rlTigaTitikTigaBelasADetail.belongsTo(rlTigaTitikTigaBelasA, {
    foreignKey:'id'
})

golonganObat.hasMany(rlTigaTitikTigaBelasADetail, {
    foreignKey:'id'
})
rlTigaTitikTigaBelasADetail.belongsTo(golonganObat, {
    foreignKey:'golongan_obat_id'
})