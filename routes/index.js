import express from 'express'

// Token
import { getDataUser, insertDataUser, login, logout, changePassword } from '../controllers/UsersController.js'
import { verifyToken } from '../middleware/VerifyToken.js'
import { refreshToken } from '../controllers/RefreshToken.js'

// References
import { getDataRumahSakit } from '../controllers/RumahSakitController.js'
import { getDataJenisPelayanan } from '../controllers/JenisPelayananController.js'
import { getDataCaraPembayaran } from '../controllers/CaraPembayaranController.js'
import { getDataJenisSpesialis } from '../controllers/JenisSpesialisController.js'
import { getDataJenisKegiatan, getDataJenisKegiatanLab } from '../controllers/JenisKegiatanController.js'
import { getDataJenisTindakan, getDataGroupJenisTindakan } from '../controllers/JenisGroupTindakanController.js'
import { getMetoda } from '../controllers/MetodaController.js'
import { getGolonganObat } from '../controllers/GolonganObatController.js'
import { getNoUrut } from '../controllers/NoUrutController.js'
import { getIcd10 } from '../controllers/Icd10Controller.js'
import { getDataJenisGolSebabPenyakit, getDataJenisGolSebabPenyakitA, getDataJenisGolSebabPenyakitAbyId, getDataJenisGolSebabPenyakitASebab} from "../controllers/JenisGolSebabPenyakitController.js"
import { getDataJenisGolonganSebabPenyakit, getDataJenisGolonganSebabPenyakitB, getDataJenisGolonganSebabPenyakitBId } from '../controllers/JenisGolonganSebabPenyakitController.js'
import { getDataJenisGolonganPenyakitB, getDataJenisGolonganPenyakitBId} from '../controllers/JenisGolonganPenyakitController.js'

// RL 1.2
import { getDatarlSatuTitikDua, insertDataRLSatuTitikDua,updateDatarlSatuTitikDua, 
    getrlSatuTitikDuaById,deleteDataRLSatuTitikDua} from '../controllers/RLSatuTitikDuaController.js'

// RL 1.3
import { getDataRLSatuTitikTiga, getDataRLSatuTitikTigaDetailById,
    insertDataRLSatuTitikTiga, updateDataRLSatuTitikTiga, deleteDataRLSatuTitikTiga } from '../controllers/RLSatuTitikTigaController.js'

// RL 3.1
import { getDataRLTigaTitikSatu, getDataRLTigaTitikSatuDetailById,
    insertDataRLTigaTitikSatu, updateDataRLTigaTitikSatu, deleteDataRLTigaTitikSatu } from '../controllers/RLTigaTitikSatuController.js'

// RL 3.2
import { getDataRLTigaTitikDua, insertDataRLTigaTitikDua, deleteDataRLTigaTitikDua, 
    getDataRLTigaTitikDuaDetail, updateDataRLTigaTitikDua } from '../controllers/RLTigaTitikDuaController.js'

// RL 3.3
import { getDataRLTigaTitikTiga, insertDataRLTigaTitikTiga, getDataRLTigaTitikTigaDetail, 
    getRLTigaTitikTigaById, updateDataRLTigaTitikTiga, deleteDataRLTigaTitikTiga } from '../controllers/RLTigaTitikTigaController.js'

// RL 3.4
import { getDataRLTigaTitikEmpat, getRLTigaTitikEmpatById, 
    insertDataRLTigaTitikEmpat, updateDataRLTigaTitikEmpat, deleteDataRLTigaTitikEmpat } from '../controllers/RLTigaTitikEmpatController.js'

// RL 3.5
import { getDataRLTigaTitikLima, getRLTigaTitikLimaById, 
    insertDataRLTigaTitikLima, updateDataRLTigaTitikLima, deleteDataRLTigaTitikLima } from '../controllers/RLTigaTitikLimaController.js'

// RL 3.6
import { getDataRLTigaTitikEnamIdTahun, 
    getDataRLTigaTitikEnamId ,insertDataRLTigaTitikEnam, deleteDataRLTigaTitikEnamId, updateDataRLTigaTitikEnamId } from '../controllers/RLTigaTitikEnamController.js'

// RL 3.8
import { deleteDataRLTigaTitikDelapan, getDataRLTigaTitikDelapan, getDataRLTigaTitikDelapanById,
    getDataRLTigaTitikDelapanDetailKegiatan, insertDataRLTigaTitikDelapan, updateDataRLTigaTitikDelapan } from "../controllers/RLTigaTitikDelapanController.js";

// RL 3.9
import { deleteDataRLTigaTitikSembilanId, getDataRLTigaTitikSembilanId, getDataRLTigaTitikSembilanIdTahun, 
    insertDataRLTigaTitikSembilan, updateDataRLTigaTitikSembilanId } from '../controllers/RLTigaTitikSembilanController.js'

// RL 3.10
import { getDatarlTigaTitikSepuluh, insertDataRLTigaTitikSepuluh, 
    getDatarlTigaTitikSepuluhDetail, getrlTigaTitikSepuluhById, updateDatarlTigaTitikSepuluh, deleteDataRLTigaTitikSepuluh } from '../controllers/RLTigaTitikSepuluhController.js'

// RL 3.11
import { getDatarlTigaTitikSebelas, insertDataRLTigaTitikSebelas, getDatarlTigaTitikSebelasDetail, 
    getrlTigaTitikSebelasById, updateDatarlTigaTitikSebelas, deleteDataRLTigaTitikSebelas } from '../controllers/RLTigaTitikSebelasController.js'
// RL 3.7
import { insertDataRLTigaTitikTujuh , getDataRLTigaTitikTujuh,getRLTigaTitikTujuhById, 
    getDataRLTigaTitikTujuhDetail, updateDataRLTigaTitikTujuh, deleteDataRLTigaTitikTujuh} 
    from '../controllers/RLTigaTitikTujuhController.js'

// RL 3.12
import { insertDataRLTigaTitikDuaBelas, getDataRLTigaTitikDuaBelas, getRLTigaTitikDuaBelasById, 
    getDataRLTigaTitikDuaBelasDetail, updateDataRLTigaTitikDuaBelas ,deleteDataRLTigaTitikDuaBelas} from '../controllers/RLTigaTitikDuaBelasController.js'

// RL 3.13A
import { insertDataRLTigaTitikTigaBelasA, getDataRLTigaTitikTigaBelasA, getRLTigaTitikTigaBelasAById, 
    getDataRLTigaTitikTigaBelasADetail, updateDataRLTigaTitikTigaBelasA ,deleteDataRLTigaTitikTigaBelasA } from '../controllers/RLTigaTitikTigaBelasAController.js'

// RL 3.13B
import { insertDataRLTigaTitikTigaBelasB, getDataRLTigaTitikTigaBelasB, getRLTigaTitikTigaBelasBById, 
    getDataRLTigaTitikTigaBelasBDetail, updateDataRLTigaTitikTigaBelasB ,deleteDataRLTigaTitikTigaBelasB } from '../controllers/RLTigaTitikTigaBelasBController.js'

// RL 3.14
import { getDataRLTigaTitikEmpatBelas, insertDataRLTigaTitikEmpatBelas, getDataRLTigaTitikEmpatBelasDetail, 
    getRLTigaTitikEmpatBelasById, updateDataRLTigaTitikEmpatBelas, deleteDataRLTigaTitikEmpatBelas } from '../controllers/RLTigaTitikEmpatBelasController.js'

// RL 3.15
import { getDataRLTigaTitikLimaBelas, 
    insertDataRLTigaTitikLimaBelas, 
    getDataRLTigaTitikLimaBelasDetail, 
    getRLTigaTitikLimaBelasById, 
    updateDataRLTigaTitikLimaBelas, 
    deleteDataRLTigaTitikLimaBelas } from '../controllers/RLTigaTitikLimaBelasController.js'

// RL 4a
import {
    deleteDataRLEmpatA,
    getDataRLEmpatA,
    getDataRLEmpatAById,
    insertDataRLEmpatA,
    updateDataRLEmpatA,
} from "../controllers/RLEmpatAController.js"

// RL 4a sebab
import {
    deleteDataRLEmpatASebab,
    getDataRLEmpatASebab,
    getDataRLEmpatASebabById,
    insertDataRLEmpatASebab,
    updateDataRLEmpatASebab,
} from "../controllers/RLEmpatASebabController.js";

// RL.4b
import { insertDataRLEmpatB, getDataRLEmpatB, deleteDataRLEmpatBId, 
    getDataRLEmpatBId, updateDataRLEmpatId } from "../controllers/RLEmpatBController.js"

// RL. 4b sebab
import { insertDataRLEmpatBSebab, getDataRLEmpatBSebab, deleteDataRLEmpatBSebabId, 
    getDataRLEmpatBSebabId,updateDataRLEmpatSebabId } from '../controllers/RLEmpatBSebabController.js'

// RL 5.1
import { getDataRLLimaTitikSatu, getRLLimaTitikSatuById, insertDataRLLimaTitikSatu, 
    updateDataRLLimaTitikSatu, deleteDataRLLimaTitikSatu } from '../controllers/RLLimaTitikSatuController.js'

// RL 5.2
import { getDataRLLimaTitikDua, getRLLimaTitikDuaById, insertDataRLLimaTitikDua, 
    updateDataRLLimaTitikDua, deleteDataRLLimaTitikDua } from '../controllers/RLLimaTitikDuaController.js'

// RL 5.3
import { insertDataRLLimaTitikTiga, getDataRLLimaTitikTiga, getRLLimaTitikTigaById, 
    getDataRLLimaTitikTigaDetail, updateDataRLLimaTitikTiga ,deleteDataRLLimaTitikTiga } from '../controllers/RLLimaTitikTigaController.js'


// RL 5.4
import { insertDataRLLimaTitikEmpat, getDataRLLimaTitikEmpat, getRLLimaTitikEmpatById, 
    getDataRLLimaTitikEmpatDetail, updateDataRLLimaTitikEmpat ,deleteDataRLLimaTitikEmpat } from '../controllers/RLLimaTitikEmpatController.js'

const router = express.Router()

// Rumah Sakit
router.get('/apisirs/rumahsakit/:id', verifyToken, getDataRumahSakit)

// User
router.get('/apisirs/users', verifyToken, getDataUser)
router.post('/apisirs/users', insertDataUser)
router.patch('/apisirs/users/:id/admin', verifyToken, changePassword)

// Token
router.post('/apisirs/login', login)
router.delete('/apisirs/logout', logout)
router.get('/apisirs/token', refreshToken)

// Jenis Pelayanan
router.get('/apisirs/jenispelayanan', verifyToken,
    getDataJenisPelayanan)

// Cara Pembayaran
router.get('/apisirs/carapembayaran', verifyToken,
    getDataCaraPembayaran)

// Jenis Kegiatan
router.get('/apisirs/jeniskegiatan', verifyToken,
getDataJenisKegiatan)
//Jenis Kegiatan Lab 3.8
router.get('/apisirs/jeniskegiatanlab', verifyToken,
getDataJenisKegiatanLab)

// Jenis Spesialis
router.get('/apisirs/jenisspesialis', verifyToken,
    getDataJenisSpesialis)

// Group Jenis Tindakan
router.get('/apisirs/jenisgrouptindakan', verifyToken, getDataGroupJenisTindakan)

// Jenis Golongan Sebab Penyakit
router.get(
    "/apisirs/jenisgolsebabpenyakit",
    verifyToken,
    getDataJenisGolSebabPenyakit
)
router.get(
    "/apisirs/jenisgolsebabpenyakita/cari",
    verifyToken,
    getDataJenisGolSebabPenyakitA
)
router.get(
    "/apisirs/jenisgolsebabpenyakitasebab/cari",
    verifyToken,
    getDataJenisGolSebabPenyakitASebab
)
router.get(
    "/apisirs/jenisgolsebabpenyakita/id",
    verifyToken,
    getDataJenisGolSebabPenyakitAbyId
)

router.get('/apisirs/jenisgolongansebabpenyakit', verifyToken, getDataJenisGolonganSebabPenyakit)

// RL 1.2
router.post('/apisirs/rlsatutitikdua', verifyToken, insertDataRLSatuTitikDua)
router.get('/apisirs/rlsatutitikdua', verifyToken, getDatarlSatuTitikDua)
router.get('/apisirs/rlsatutitikduadetail/:id',verifyToken,getrlSatuTitikDuaById )
router.delete("/apisirs/rlsatutitikdua/:id", verifyToken, deleteDataRLSatuTitikDua)
router.patch('/apisirs/rlsatutitikdua/:id', verifyToken, updateDatarlSatuTitikDua)

// RL 1.3
router.post('/apisirs/rlsatutitiktiga', verifyToken, insertDataRLSatuTitikTiga)
router.get('/apisirs/rlsatutitiktiga', verifyToken, getDataRLSatuTitikTiga)
router.get('/apisirs/rlsatutitiktigadetail/:id', verifyToken, getDataRLSatuTitikTigaDetailById)
router.patch('/apisirs/rlsatutitiktiga/:id', verifyToken, updateDataRLSatuTitikTiga)
router.delete('/apisirs/rlsatutitiktiga/:id', verifyToken, deleteDataRLSatuTitikTiga)

// RL 3.1
router.post('/apisirs/rltigatitiksatu', verifyToken, insertDataRLTigaTitikSatu)
router.get('/apisirs/rltigatitiksatu', verifyToken, getDataRLTigaTitikSatu)
router.get('/apisirs/rltigatitiksatudetail/:id', verifyToken, getDataRLTigaTitikSatuDetailById)
router.patch('/apisirs/rltigatitiksatu/:id', verifyToken, updateDataRLTigaTitikSatu)
router.delete('/apisirs/rltigatitiksatu/:id', verifyToken, deleteDataRLTigaTitikSatu)

// RL 3.2
router.post('/apisirs/rltigatitikdua', verifyToken, insertDataRLTigaTitikDua)
router.get('/apisirs/rltigatitikdua', verifyToken, getDataRLTigaTitikDua)
router.delete('/apisirs/rltigatitikdua/:id', verifyToken, deleteDataRLTigaTitikDua)
router.get('/apisirs/rltigatitikduadetail/:id', verifyToken, getDataRLTigaTitikDuaDetail)
router.patch('/apisirs/rltigatitikduadetail/:id', verifyToken, updateDataRLTigaTitikDua)

// RL 3.3
router.post('/apisirs/rltigatitiktiga', verifyToken, insertDataRLTigaTitikTiga)
router.get('/apisirs/rltigatitiktiga', verifyToken, getDataRLTigaTitikTiga)
router.delete('/apisirs/rltigatitiktigadetail/:id', verifyToken, deleteDataRLTigaTitikTiga)
router.get('/apisirs/rltigatitiktigadetail',verifyToken, getDataRLTigaTitikTigaDetail)
router.get('/apisirs/rltigatitiktigadetail/:id',verifyToken, getRLTigaTitikTigaById)
router.patch('/apisirs/rltigatitiktigadetail/:id',verifyToken, updateDataRLTigaTitikTiga)

// RL 3.4
router.post('/apisirs/rltigatitikempat', verifyToken, insertDataRLTigaTitikEmpat)
router.get('/apisirs/rltigatitikempat', verifyToken, getDataRLTigaTitikEmpat)
router.get('/apisirs/rltigatitikempatdetail/:id',verifyToken, getRLTigaTitikEmpatById)
router.delete('/apisirs/rltigatitikempat/:id', verifyToken, deleteDataRLTigaTitikEmpat)
router.patch('/apisirs/rltigatitikempatdetail/:id', verifyToken, updateDataRLTigaTitikEmpat)

// RL 3.5
router.post('/apisirs/rltigatitiklima', verifyToken, insertDataRLTigaTitikLima)
router.get('/apisirs/rltigatitiklima', verifyToken, getDataRLTigaTitikLima)
router.get('/apisirs/rltigatitiklimadetail/:id',verifyToken, getRLTigaTitikLimaById)
router.delete('/apisirs/rltigatitiklima/:id', verifyToken, deleteDataRLTigaTitikLima)
router.patch('/apisirs/rltigatitiklimadetail/:id',verifyToken, updateDataRLTigaTitikLima)

// RL 3.6
router.post('/apisirs/rltigatitikenam', verifyToken, insertDataRLTigaTitikEnam)
router.get('/apisirs/rltigatitikenam', verifyToken, getDataRLTigaTitikEnamIdTahun)
router.get('/apisirs/rltigatitikenam/update/:id', verifyToken, getDataRLTigaTitikEnamId)
router.patch('/apisirs/rltigatitikenam/:id', verifyToken, updateDataRLTigaTitikEnamId)
router.delete('/apisirs/rltigatitikenam/:id', verifyToken, deleteDataRLTigaTitikEnamId)

// RL 3.7
router.post('/apisirs/rltigatitiktujuh', verifyToken, insertDataRLTigaTitikTujuh)
router.get('/apisirs/rltigatitiktujuh', verifyToken, getDataRLTigaTitikTujuh)
router.get('/apisirs/rltigatitiktujuhdetail',verifyToken, getDataRLTigaTitikTujuhDetail)
router.get('/apisirs/rltigatitiktujuhdetail/:id',verifyToken, getRLTigaTitikTujuhById)
router.patch('/apisirs/rltigatitiktujuhdetail/:id',verifyToken, updateDataRLTigaTitikTujuh)
router.delete('/apisirs/rltigatitiktujuhdetail/:id', verifyToken, deleteDataRLTigaTitikTujuh)

// RL 3.8
router.post(
    "/apisirs/rltigatitikdelapan",
    verifyToken,
    insertDataRLTigaTitikDelapan
);
router.get(
    "/apisirs/rltigatitikdelapan",
    verifyToken,
    getDataRLTigaTitikDelapanDetailKegiatan
);
router.get(
    "/apisirs/rltigatitikdelapan/:id",
    verifyToken,
    getDataRLTigaTitikDelapanById
);
router.delete(
    "/apisirs/rltigatitikdelapan/:id",
    verifyToken,
    deleteDataRLTigaTitikDelapan
);
router.patch(
    "/apisirs/rltigatitikdelapan/:id",
    verifyToken,
    updateDataRLTigaTitikDelapan
);

// RL 3.9
router.post('/apisirs/rltigatitiksembilan', verifyToken, insertDataRLTigaTitikSembilan)
// router.get('/apisirs/rltigatitiksembilan', getDataRLTigaTitikSembilan)
router.get('/apisirs/rltigatitiksembilan', verifyToken, getDataRLTigaTitikSembilanIdTahun)
router.get('/apisirs/rltigatitiksembilan/update/:id', verifyToken, getDataRLTigaTitikSembilanId)
router.patch('/apisirs/rltigatitiksembilan/:id', verifyToken, updateDataRLTigaTitikSembilanId)
router.delete('/apisirs/rltigatitiksembilan/:id', verifyToken, deleteDataRLTigaTitikSembilanId)

// RL 3.10
router.post('/apisirs/rltigatitiksepuluh', verifyToken, insertDataRLTigaTitikSepuluh)
router.get('/apisirs/rltigatitiksepuluh', verifyToken, getDatarlTigaTitikSepuluh)
router.get('/apisirs/rltigatitiksepuluhdetail',verifyToken, getDatarlTigaTitikSepuluhDetail)
router.get('/apisirs/rltigatitiksepuluhdetail/:id',verifyToken, getrlTigaTitikSepuluhById)
router.patch('/apisirs/rltigatitiksepuluhdetail/:id',verifyToken, updateDatarlTigaTitikSepuluh)
router.delete('/apisirs/rltigatitiksepuluhdetail/:id', verifyToken, deleteDataRLTigaTitikSepuluh)

//Rl 3.11
router.post('/apisirs/rltigatitiksebelas', verifyToken, insertDataRLTigaTitikSebelas)
router.get('/apisirs/rltigatitiksebelas', verifyToken, getDatarlTigaTitikSebelas)
router.get('/apisirs/rltigatitiksebelasdetail',verifyToken, getDatarlTigaTitikSebelasDetail)
router.get('/apisirs/rltigatitiksebelasdetail/:id',verifyToken, getrlTigaTitikSebelasById)
router.patch('/apisirs/rltigatitiksebelasdetail/:id',verifyToken, updateDatarlTigaTitikSebelas)
router.delete('/apisirs/rltigatitiksebelasdetail/:id', verifyToken, deleteDataRLTigaTitikSebelas)



// RL 3.12
router.post('/apisirs/rltigatitikduabelas', verifyToken, insertDataRLTigaTitikDuaBelas)
router.get('/apisirs/rltigatitikduabelas', verifyToken, getDataRLTigaTitikDuaBelas)
router.get('/apisirs/rltigatitikduabelasdetail',verifyToken, getDataRLTigaTitikDuaBelasDetail)
router.get('/apisirs/rltigatitikduabelasdetail/:id',verifyToken, getRLTigaTitikDuaBelasById)
router.patch('/apisirs/rltigatitikduabelasdetail/:id',verifyToken, updateDataRLTigaTitikDuaBelas);
router.delete('/apisirs/rltigatitikduabelasdetail/:id', verifyToken, deleteDataRLTigaTitikDuaBelas);
router.get('/apisirs/getmetoda', verifyToken, getMetoda)

// RL 3.13a
router.post('/apisirs/rltigatitiktigabelasa', verifyToken, insertDataRLTigaTitikTigaBelasA)
router.get('/apisirs/rltigatitiktigabelasa', verifyToken, getDataRLTigaTitikTigaBelasA)
router.get('/apisirs/rltigatitiktigabelasadetail',verifyToken, getDataRLTigaTitikTigaBelasADetail)
router.get('/apisirs/rltigatitiktigabelasadetail/:id',verifyToken, getRLTigaTitikTigaBelasAById)
router.patch('/apisirs/rltigatitiktigabelasadetail/:id',verifyToken, updateDataRLTigaTitikTigaBelasA);
router.delete('/apisirs/rltigatitiktigabelasadetail/:id', verifyToken, deleteDataRLTigaTitikTigaBelasA);
router.get('/apisirs/getgolonganobat', verifyToken, getGolonganObat)

// RL 3.13b
router.post('/apisirs/rltigatitiktigabelasb', verifyToken, insertDataRLTigaTitikTigaBelasB)
router.get('/apisirs/rltigatitiktigabelasb', verifyToken, getDataRLTigaTitikTigaBelasB)
router.get('/apisirs/rltigatitiktigabelasbdetail',verifyToken, getDataRLTigaTitikTigaBelasBDetail)
router.get('/apisirs/rltigatitiktigabelasbdetail/:id',verifyToken, getRLTigaTitikTigaBelasBById)
router.patch('/apisirs/rltigatitiktigabelasbdetail/:id',verifyToken, updateDataRLTigaTitikTigaBelasB);
router.delete('/apisirs/rltigatitiktigabelasbdetail/:id', verifyToken, deleteDataRLTigaTitikTigaBelasB);
router.get('/apisirs/getgolonganobat', verifyToken, getGolonganObat)

// RL 3.14
router.post('/apisirs/rltigatitikempatbelas', verifyToken, insertDataRLTigaTitikEmpatBelas)
router.get('/apisirs/rltigatitikempatbelas', verifyToken, getDataRLTigaTitikEmpatBelas)
router.delete('/apisirs/rltigatitikempatbelasdetail/:id', verifyToken, deleteDataRLTigaTitikEmpatBelas)
router.get('/apisirs/rltigatitikempatbelasdetail/:id',verifyToken, getDataRLTigaTitikEmpatBelasDetail)
router.get('/apisirs/rltigatitikempatbelasdetail/:id',verifyToken, getRLTigaTitikEmpatBelasById)
router.patch('/apisirs/rltigatitikempatbelasdetail/:id',verifyToken, updateDataRLTigaTitikEmpatBelas)

// RL 3.15
router.post('/apisirs/rltigatitiklimabelas', verifyToken, insertDataRLTigaTitikLimaBelas)
router.get('/apisirs/rltigatitiklimabelas', verifyToken, getDataRLTigaTitikLimaBelas)
router.delete('/apisirs/rltigatitiklimabelasdetail/:id', deleteDataRLTigaTitikLimaBelas)
router.get('/apisirs/rltigatitiklimabelasdetail/:id',verifyToken, getDataRLTigaTitikLimaBelasDetail)
router.get('/apisirs/rltigatitiklimabelasdetail/:id',verifyToken, getRLTigaTitikLimaBelasById)
router.patch('/apisirs/rltigatitiklimabelasdetail/:id',verifyToken, updateDataRLTigaTitikLimaBelas)

// RL 4a
router.post("/apisirs/rlempata", verifyToken, insertDataRLEmpatA);
router.get("/apisirs/rlempata", verifyToken, getDataRLEmpatA);
router.delete("/apisirs/rlempata/:id", verifyToken, deleteDataRLEmpatA);
router.get("/apisirs/rlempata/:id", verifyToken, getDataRLEmpatAById);
router.patch("/apisirs/rlempata/:id", verifyToken, updateDataRLEmpatA);

// RL 4aSebab
router.post("/apisirs/rlempatasebab", verifyToken, insertDataRLEmpatASebab);
router.get("/apisirs/rlempatasebab", verifyToken, getDataRLEmpatASebab);
router.delete(
    "/apisirs/rlempatasebab/:id",
    verifyToken,
    deleteDataRLEmpatASebab
);
router.get("/apisirs/rlempatasebab/:id", verifyToken, getDataRLEmpatASebabById);
router.patch(
    "/apisirs/rlempatasebab/:id",
    verifyToken,
    updateDataRLEmpatASebab
);

// RL 4b
router.post('/apisirs/rlempatb', verifyToken, insertDataRLEmpatB)
router.get('/apisirs/rlempatb', verifyToken, getDataRLEmpatB)
router.delete('/apisirs/rlempatb/:id', verifyToken, deleteDataRLEmpatBId)
router.get('/apisirs/rlempatb/penyakit', verifyToken, getDataJenisGolonganPenyakitB)
router.get('/apisirs/rlempatb/idpenyakit', verifyToken, getDataJenisGolonganPenyakitBId)
router.get('/apisirs/rlempatb/update/:id', verifyToken, getDataRLEmpatBId)
router.patch('/apisirs/rlempatb/:id', verifyToken, updateDataRLEmpatId)

// RL 4b sebab
router.post('/apisirs/rlempatbsebab', verifyToken, insertDataRLEmpatBSebab)
router.get('/apisirs/rlempatbsebab', verifyToken, getDataRLEmpatBSebab)
router.get('/apisirs/rlempatbsebab/penyakit', verifyToken, getDataJenisGolonganSebabPenyakitB)
router.get('/apisirs/rlempatbsebab/idpenyakit', verifyToken, getDataJenisGolonganSebabPenyakitBId)
router.delete('/apisirs/rlempatbsebab/:id', verifyToken, deleteDataRLEmpatBSebabId)
router.get('/apisirs/rlempatbsebab/update/:id', verifyToken, getDataRLEmpatBSebabId)
router.patch('/apisirs/rlempatbsebab/:id', verifyToken, updateDataRLEmpatSebabId)

// RL 5.1
router.post('/apisirs/rllimatitiksatu', verifyToken, insertDataRLLimaTitikSatu)
router.get('/apisirs/rllimatitiksatu', verifyToken, getDataRLLimaTitikSatu)
router.get('/apisirs/rllimatitiksatudetail/:id',verifyToken, getRLLimaTitikSatuById)
router.delete('/apisirs/rllimatitiksatu/:id', verifyToken, deleteDataRLLimaTitikSatu)
router.patch('/apisirs/rllimatitiksatudetail/:id', verifyToken, updateDataRLLimaTitikSatu)

// RL 5.2
router.post('/apisirs/rllimatitikdua', verifyToken, insertDataRLLimaTitikDua)
router.get('/apisirs/rllimatitikdua', verifyToken, getDataRLLimaTitikDua)
router.get('/apisirs/rllimatitikduadetail/:id',verifyToken, getRLLimaTitikDuaById)
router.delete('/apisirs/rllimatitikdua/:id', verifyToken, deleteDataRLLimaTitikDua)
router.patch('/apisirs/rllimatitikduadetail/:id', verifyToken, updateDataRLLimaTitikDua)

// RL 5.3
router.post('/apisirs/rllimatitiktiga', verifyToken, insertDataRLLimaTitikTiga)
router.get('/apisirs/rllimatitiktiga', verifyToken, getDataRLLimaTitikTiga)
router.get('/apisirs/rllimatitiktigadetail',verifyToken, getDataRLLimaTitikTigaDetail)
router.get('/apisirs/rllimatitiktigadetail/:id',verifyToken, getRLLimaTitikTigaById)
router.patch('/apisirs/rllimatitiktigadetail/:id',verifyToken, updateDataRLLimaTitikTiga);
router.delete('/apisirs/rllimatitiktigadetail/:id', deleteDataRLLimaTitikTiga);
router.get('/apisirs/getnourut', verifyToken, getNoUrut)
router.get('/apisirs/geticd10', verifyToken, getIcd10)

// RL 5.4
router.post('/apisirs/rllimatitikempat', verifyToken, insertDataRLLimaTitikEmpat)
router.get('/apisirs/rllimatitikempat', verifyToken, getDataRLLimaTitikEmpat)
router.get('/apisirs/rllimatitikempatdetail',verifyToken, getDataRLLimaTitikEmpatDetail)
router.get('/apisirs/rllimatitikempatdetail/:id',verifyToken, getRLLimaTitikEmpatById)
router.patch('/apisirs/rllimatitikempatdetail/:id',verifyToken, updateDataRLLimaTitikEmpat);
router.delete('/apisirs/rllimatitikempatdetail/:id', verifyToken, deleteDataRLLimaTitikEmpat);
router.get('/apisirs/getnourut', verifyToken, getNoUrut)
router.get('/apisirs/geticd10', verifyToken, getIcd10)

export default router