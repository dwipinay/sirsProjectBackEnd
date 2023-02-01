import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const rlTigaTitikSembilanHeader = databaseSIRS.define('rl_tiga_titik_sembilan',{
    rs_id:{
        type: DataTypes.STRING
    },
    tahun:{
        type: DataTypes.INTEGER
    },
    user_id:{
        type: DataTypes.INTEGER
    }
})

export const rlTigaTitikSembilanDetail = databaseSIRS.define('rl_tiga_titik_sembilan_detail', 
    {
        rl_tiga_titik_sembilan_id:{
            type: DataTypes.INTEGER
        },
        jenis_tindakan_id:{
            type: DataTypes.INTEGER
        },
        rs_id:{
            type: DataTypes.STRING
        },
        tahun:{
            type: DataTypes.INTEGER
        },
        jumlah:{
            type: DataTypes.INTEGER
        }, 
        user_id: {
            type: DataTypes.INTEGER
        }
    }
)

// export const rlTigaTitikSembilanTindakan = databaseSIRS.define('jenis_tindakan', 
//     {
//         id:{
//             type: DataTypes.INTEGER,
//             primaryKey: true
//         },
//         rl_id:{
//             type: DataTypes.INTEGER
//         },
//         no:{
//             type: DataTypes.STRING
//         },
//         nama:{
//             type: DataTypes.STRING
//         }
//     }
// )

export const jenisGroupTindakanHeader = databaseSIRS.define('group_jenis_tindakan_header', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nama:{
        type: DataTypes.STRING
    },    
    rl_id: {
        type: DataTypes.INTEGER
    },
})

export const jenisGroupTindakan = databaseSIRS.define('group_jenis_tindakan', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    group_jenis_tindakan_header_id: {
        type: DataTypes.INTEGER,
    },
    no:{
        type: DataTypes.STRING
    },
    nama:{
        type: DataTypes.STRING
    }, 
})


rlTigaTitikSembilanHeader.hasMany(rlTigaTitikSembilanDetail, {foreignKey:'rl_tiga_titik_sembilan_id'})
rlTigaTitikSembilanDetail.belongsTo(rlTigaTitikSembilanHeader, {foreignKey:'id'})

jenisGroupTindakan.hasMany(rlTigaTitikSembilanDetail, {foreignKey: 'id'})
rlTigaTitikSembilanDetail.belongsTo(jenisGroupTindakan, {foreignKey: 'jenis_tindakan_id'})

jenisGroupTindakanHeader.hasMany(jenisGroupTindakan, {foreignKey: 'id'})
jenisGroupTindakan.belongsTo(jenisGroupTindakanHeader, {foreignKey: 'group_jenis_tindakan_header_id'})

// rlTigaTitikSembilanTindakan.hasMany(rlTigaTitikSembilanDetail, {foreignKey: 'id'})
// rlTigaTitikSembilanDetail.belongsTo(rlTigaTitikSembilanTindakan, {foreignKey:'jenis_tindakan_id'})