import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from '../config/Database.js'

export const rlTigaTitikTujuh = databaseSIRS.define(
    "rl_tiga_titik_tujuh",
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
  
  export const rlTigaTitikTujuhDetail = databaseSIRS.define(
    "rl_tiga_titik_tujuh_detail",
    {
      rl_tiga_titik_tujuh_id: {
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
  export const jenisKegiatan = databaseSIRS.define('jenis_kegiatan', 
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    group_jenis_kegiatan_id: {
        type: DataTypes.INTEGER,
    },
        nama: {
            type: DataTypes.STRING
        },
        no: {
          type: DataTypes.NUMBER
      },
    }
)


export const jenisGroupKegiatanHeader = databaseSIRS.define('group_jenis_kegiatan_header', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true
  },
  nama:{
      type: DataTypes.STRING
  },  
    
    no: {
        type: DataTypes.STRING
    }  
 
})


rlTigaTitikTujuh.hasMany(rlTigaTitikTujuhDetail, {foreignKey:'rl_tiga_titik_tujuh_id'})
rlTigaTitikTujuhDetail.belongsTo(rlTigaTitikTujuh, {foreignKey:'id'})

jenisKegiatan.hasMany(rlTigaTitikTujuhDetail, {foreignKey: 'id'})
rlTigaTitikTujuhDetail.belongsTo(jenisKegiatan, {foreignKey: 'jenis_kegiatan_id'})

jenisGroupKegiatanHeader.hasMany(jenisKegiatan, {foreignKey: 'id'})
jenisKegiatan.belongsTo(jenisGroupKegiatanHeader, {foreignKey: 'group_jenis_kegiatan_id'})

