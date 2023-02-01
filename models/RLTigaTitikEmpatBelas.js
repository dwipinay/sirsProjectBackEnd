import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikEmpatBelasHeader = databaseSIRS.define('rl_tiga_titik_empat_belas', 
    {
        rs_id: {
            type: DataTypes.STRING
        },
        tahun: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
    }
)
 
export const rlTigaTitikEmpatBelasDetail = databaseSIRS.define('rl_tiga_titik_empat_belas_detail',{
    rl_tiga_titik_empat_belas_id: {
        type: DataTypes.INTEGER
    },
    rs_id: {
        type: DataTypes.INTEGER
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    jenis_spesialis_id: {
        type: DataTypes.INTEGER
    },
    rujukan_diterima_dari_puskesmas: {
        type: DataTypes.INTEGER
    },
    rujukan_diterima_dari_fasilitas_kesehatan_lain: {
        type: DataTypes.INTEGER
    },
    rujukan_diterima_dari_rs_lain: {
        type: DataTypes.INTEGER
    },
    rujukan_dikembalikan_ke_puskesmas: {
        type: DataTypes.INTEGER
    },
    rujukan_dikembalikan_ke_fasilitas_kesehatan_lain: {
        type: DataTypes.INTEGER
    },
    rujukan_dikembalikan_ke_rs_asal: {
        type: DataTypes.INTEGER
    },
    dirujukan_pasien_rujukan: {
        type: DataTypes.INTEGER
    },
    dirujuk_pasien_datang_sendiri: {
        type: DataTypes.INTEGER
    },                
    dirujuk_diterima_kembali: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    }
})

export const jenisSpesialis = databaseSIRS.define('jenis_spesialisasi', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no: {
            type: DataTypes.STRING
        },
    }
)

rlTigaTitikEmpatBelasHeader.hasMany(rlTigaTitikEmpatBelasDetail, {
    foreignKey:'rl_tiga_titik_empat_belas_id'
})

rlTigaTitikEmpatBelasDetail.belongsTo(rlTigaTitikEmpatBelasHeader, {
    foreignKey:'id'
})

jenisSpesialis.hasMany(rlTigaTitikEmpatBelasDetail, {
    foreignKey:'id'
})
rlTigaTitikEmpatBelasDetail.belongsTo(jenisSpesialis, {
    foreignKey:'jenis_spesialis_id'
})