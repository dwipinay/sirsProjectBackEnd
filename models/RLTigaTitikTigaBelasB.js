import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from '../config/Database.js'

export const rlTigaTitikTigaBelasB = databaseSIRS.define(
    "rl_tiga_titik_tiga_belas_b",
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
      
   
    },
  );
  
  export const rlTigaTitikTigaBelasBDetail = databaseSIRS.define(
    "rl_tiga_titik_tiga_belas_b_detail",
    {
      rl_tiga_titik_tiga_belas_b_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      golongan_obat_id: {
        type: DataTypes.INTEGER,
      },
      jumlah_item_obat: {
        type: DataTypes.INTEGER,
      },
      jumlah_item_obat_rs: {
        type: DataTypes.INTEGER,
      },
      jumlah_item_obat_formulatorium: {
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


rlTigaTitikTigaBelasB.hasMany(rlTigaTitikTigaBelasBDetail, {
    foreignKey:'rl_tiga_titik_tiga_belas_b_id'
})
rlTigaTitikTigaBelasBDetail.belongsTo(rlTigaTitikTigaBelasB, {
    foreignKey:'id'
})

golonganObat.hasMany(rlTigaTitikTigaBelasBDetail, {
    foreignKey:'id'
})
rlTigaTitikTigaBelasBDetail.belongsTo(golonganObat, {
    foreignKey:'golongan_obat_id'
})