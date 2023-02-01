import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikSebelasHeader = databaseSIRS.define('rl_tiga_titik_sebelas', 
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

export const rlTigaTitikSebelasDetail = databaseSIRS.define('rl_tiga_titik_sebelas_detail',{
    rl_tiga_titik_sebelas_id: {
        type: DataTypes.INTEGER
    },
    rs_id: {
        type: DataTypes.INTEGER
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    jenis_pelayanan_id: {
        type: DataTypes.INTEGER
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.INTEGER
    }
})

export const jenisPelayanan = databaseSIRS.define('jenis_pelayanan', 
    {
        nama: {
            type: DataTypes.STRING
        },
        no: {
            type: DataTypes.NUMBER
        },
    }
)

rlTigaTitikSebelasHeader.hasMany(rlTigaTitikSebelasDetail, {
    foreignKey:'rl_tiga_titik_sebelas_id'
})

rlTigaTitikSebelasDetail.belongsTo(rlTigaTitikSebelasHeader, {
    foreignKey:'id'
})

jenisPelayanan.hasMany(rlTigaTitikSebelasDetail, {
    foreignKey:'id'
})
rlTigaTitikSebelasDetail.belongsTo(jenisPelayanan, {
    foreignKey:'jenis_pelayanan_id'
})