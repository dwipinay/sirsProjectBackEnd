import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikEmpatHeader = databaseSIRS.define('rl_tiga_titik_empat', 
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

export const rlTigaTitikEmpatDetail = databaseSIRS.define('rl_tiga_titik_empat_detail',{
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    rl_tiga_titik_empat_id: {
        type: DataTypes.INTEGER
    },
    jenis_kegiatan_id: {
        type: DataTypes.INTEGER
    },
    rmRumahSakit: {
        type: DataTypes.INTEGER
    },
    rmBidan: {
        type: DataTypes.INTEGER
    },
    rmPuskesmas: {
        type: DataTypes.INTEGER
    },
    rmFaskesLainnya: {
        type: DataTypes.INTEGER
    },
    rmHidup: {
        type: DataTypes.INTEGER
    },
    rmMati: {
        type: DataTypes.INTEGER
    },
    rmTotal: {
        type: DataTypes.INTEGER
    },
    rnmHidup: {
        type: DataTypes.INTEGER
    },
    rnmMati: {
        type: DataTypes.INTEGER
    },
    rnmTotal: {
        type: DataTypes.INTEGER
    },
    nrHidup: {
        type: DataTypes.INTEGER
    },
    nrMati: {
        type: DataTypes.INTEGER
    },
    nrTotal: {
        type: DataTypes.INTEGER
    },
    dirujuk: {
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
    }
)


rlTigaTitikEmpatHeader.hasMany(rlTigaTitikEmpatDetail, {
    foreignKey:'rl_tiga_titik_empat_id'
})
rlTigaTitikEmpatDetail.belongsTo(rlTigaTitikEmpatHeader, {
    foreignKey:'id'
})

jenisKegiatan.hasMany(rlTigaTitikEmpatDetail, {
    foreignKey:'id'
})
rlTigaTitikEmpatDetail.belongsTo(jenisKegiatan, {
    foreignKey:'jenis_kegiatan_id'
})