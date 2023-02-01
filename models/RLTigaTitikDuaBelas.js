import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from '../config/Database.js'

export const rlTigaTitikDuaBelas = databaseSIRS.define(
    "rl_tiga_titik_dua_belas",
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
  
  export const rlTigaTitikDuaBelasDetail = databaseSIRS.define(
    "rl_tiga_titik_dua_belas_detail",
    {
      rl_tiga_titik_dua_belas_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      metoda_id: {
        type: DataTypes.INTEGER,
      },
      konseling_anc: {
        type: DataTypes.INTEGER,
      },
      konseling_pasca_persalinan: {
        type: DataTypes.INTEGER,
      },
      kb_baru_bukan_rujukan: {
        type: DataTypes.INTEGER,
      },
      kb_baru_rujukan_inap: {
        type: DataTypes.INTEGER,
      },
      kb_baru_rujukan_jalan: {
        type: DataTypes.INTEGER,
      },
      kb_baru_total: {
        type: DataTypes.INTEGER,
      },
      kb_baru_pasca_persalinan: {
        type: DataTypes.INTEGER,
      },
      kb_baru_abortus: {
        type: DataTypes.INTEGER,
      },
      kb_baru_lainnya: {
        type: DataTypes.INTEGER,
      },
      kunjungan_ulang: {
        type: DataTypes.INTEGER,
      },
      keluhan_efek_samping_jumlah: {
        type: DataTypes.INTEGER,
      },
      keluhan_efek_samping_dirujuk: {
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
  export const metoda = databaseSIRS.define('metoda', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no: {
          type: DataTypes.NUMBER
      },
    }
)


rlTigaTitikDuaBelas.hasMany(rlTigaTitikDuaBelasDetail, {
    foreignKey:'rl_tiga_titik_dua_belas_id'
})
rlTigaTitikDuaBelasDetail.belongsTo(rlTigaTitikDuaBelas, {
    foreignKey:'id'
})

metoda.hasMany(rlTigaTitikDuaBelasDetail, {
    foreignKey:'id'
})
rlTigaTitikDuaBelasDetail.belongsTo(metoda, {
    foreignKey:'metoda_id'
})