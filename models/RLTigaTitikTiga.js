import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikTigaHeader = databaseSIRS.define('rl_tiga_titik_tiga', 
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

export const rlTigaTitikTigaDetail = databaseSIRS.define('rl_tiga_titik_tiga_detail',{
    rl_tiga_titik_tiga_id: {
        type: DataTypes.INTEGER
    },
    rs_id: {
        type: DataTypes.INTEGER
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    jenis_kegiatan_id: {
        type: DataTypes.INTEGER
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    }
})

export const jenisKegiatan = databaseSIRS.define('jenis_kegiatan', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no: {
            type: DataTypes.NUMBER
        },
    }
)

rlTigaTitikTigaHeader.hasMany(rlTigaTitikTigaDetail, {
    foreignKey:'rl_tiga_titik_tiga_id'
})

rlTigaTitikTigaDetail.belongsTo(rlTigaTitikTigaHeader, {
    foreignKey:'id'
})

jenisKegiatan.hasMany(rlTigaTitikTigaDetail, {
    foreignKey:'id'
})
rlTigaTitikTigaDetail.belongsTo(jenisKegiatan, {
    foreignKey:'jenis_kegiatan_id'
})