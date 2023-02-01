import { DataTypes, QueryTypes } from "sequelize";
import { databaseSIRS } from "../config/Database.js";

export const rlEmpatBSebabHeader = databaseSIRS.define('rl_empat_b_sebab',
    {
        rs_id:{
            type: DataTypes.STRING
        },
        tahun:{
            type: DataTypes.INTEGER
        },
        user_id:{
            type: DataTypes.INTEGER
        }
    }
)

export const rlEmpatBSebabDetail = databaseSIRS.define('rl_empat_b_sebab_detail', 
    {
        rl_empat_b_sebab_id:{
            type: DataTypes.INTEGER
        },
        rs_id:{
            type: DataTypes.STRING
        },
        tahun:{
            type: DataTypes.INTEGER
        },
        jenis_golongan_sebab_penyakit_id:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_0_6hr_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_0_6hr_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_6_28hr_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_6_28hr_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_28hr_1th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_28hr_1th_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_1_4th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_1_4th_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_4_14th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_4_14th_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_14_24th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_14_24th_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_24_44th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_24_44th_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_44_64th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_44_64th_p:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_lebih_64th_l:{
            type: DataTypes.INTEGER
        },
        jmlh_pas_kasus_umur_sex_lebih_64th_p:{
            type: DataTypes.INTEGER
        },
        kasus_baru_l:{
            type: DataTypes.INTEGER
        },
        kasus_baru_p:{
            type: DataTypes.INTEGER
        },
        jumlah_kasus_baru:{
            type: DataTypes.INTEGER
        },
        jumlah_kunjungan:{
            type: DataTypes.INTEGER
        },
        user_id:{
            type: DataTypes.INTEGER
        }
    }
)

export const rlEmpatJenisGolPenyakit = databaseSIRS.define('jenis_golongan_sebab_penyakit', 
    {
        rl_id:{
            type: DataTypes.INTEGER
        }, 
        no:{
            type: DataTypes.STRING
        },
        gender:{
            type: DataTypes.INTEGER
        },
        no_dtd:{
            type: DataTypes.STRING
        },
        no_daftar_terperinci:{
            type: DataTypes.STRING
        },
        nama:{
            type: DataTypes.STRING
        }
    }
)


rlEmpatBSebabHeader.hasMany(rlEmpatBSebabDetail, {foreignKey:'rl_empat_b_sebab_id'})
rlEmpatBSebabDetail.belongsTo(rlEmpatBSebabHeader, {foreignKey:'id'})

rlEmpatJenisGolPenyakit.hasMany(rlEmpatBSebabDetail, {foreignKey:'id'})
rlEmpatBSebabDetail.belongsTo(rlEmpatJenisGolPenyakit, {foreignKey:'jenis_golongan_sebab_penyakit_id'})