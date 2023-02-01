import { DataTypes, QueryTypes } from "sequelize"
import { databaseSIRS } from "../config/Database.js"

export const rlTigaTitikLimaHeader = databaseSIRS.define('rl_tiga_titik_lima', 
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

export const rlTigaTitikLimaDetail = databaseSIRS.define('rl_tiga_titik_lima_detail',{
    rs_id: {
        type: DataTypes.STRING
    },
    tahun: {
        type: DataTypes.INTEGER
    },
    rl_tiga_titik_lima_id: {
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
    rmMati: {
        type: DataTypes.INTEGER
    },
    rmTotal: {
        type: DataTypes.INTEGER
    },
    rnmMati: {
        type: DataTypes.INTEGER
    },
    rnmTotal: {
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
    no:{
        type: DataTypes.STRING
    }
    
})


rlTigaTitikLimaHeader.hasMany(rlTigaTitikLimaDetail, {foreignKey:'rl_tiga_titik_lima_id'})
rlTigaTitikLimaDetail.belongsTo(rlTigaTitikLimaHeader, {foreignKey:'id'})

jenisKegiatan.hasMany(rlTigaTitikLimaDetail, {foreignKey: 'id'})
rlTigaTitikLimaDetail.belongsTo(jenisKegiatan, {foreignKey: 'jenis_kegiatan_id'})

jenisGroupKegiatanHeader.hasMany(jenisKegiatan, {foreignKey: 'id'})
jenisKegiatan.belongsTo(jenisGroupKegiatanHeader, {foreignKey: 'group_jenis_kegiatan_id'})


// rlTigaTitikLimaHeader.hasMany(rlTigaTitikLimaDetail, {
//     foreignKey:'rl_tiga_titik_lima_id'
// })
// rlTigaTitikLimaDetail.belongsTo(rlTigaTitikLimaHeader, {
//     foreignKey:'id'
// })

// jenisKegiatan.hasMany(rlTigaTitikLimaDetail, {
//     foreignKey:'id'
// })
// rlTigaTitikLimaDetail.belongsTo(jenisKegiatan, {
//     foreignKey:'jenis_kegiatan_id'
// })