import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikSepuluhHeader = databaseSIRS.define('rl_tiga_titik_sepuluh', 
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

export const rlTigaTitikSepuluhDetail = databaseSIRS.define('rl_tiga_titik_sepuluh_detail',{
    rl_tiga_titik_sepuluh_id: {
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

rlTigaTitikSepuluhHeader.hasMany(rlTigaTitikSepuluhDetail, {
    foreignKey:'rl_tiga_titik_sepuluh_id'
})

rlTigaTitikSepuluhDetail.belongsTo(rlTigaTitikSepuluhHeader, {
    foreignKey:'id'
})

jenisKegiatan.hasMany(rlTigaTitikSepuluhDetail, {
    foreignKey:'id'
})
rlTigaTitikSepuluhDetail.belongsTo(jenisKegiatan, {
    foreignKey:'jenis_kegiatan_id'
})