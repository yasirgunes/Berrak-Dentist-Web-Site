const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//console.log("Girdim1!");


const path = require("path");
const { URL } = require("url");
const dirName = path.dirname(require.main.filename);

//Form'un verilerini okumak için bu 3 satıra ihtiyaç var. req.body yapabilmek için gerekli. 
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(express.static(dirName + '/public'));


// Import the MongoDB driver for Node.js
const MongoClient = require('mongodb').MongoClient;

//Mongodb'ye bağlanmak için url:
const url = 'mongodb://localhost:27017';



//localhost:3000/admin_panel/create_account'e post etmeli

//this will create new personel account. And will add it to database.
// router.post('/create_account', async (req, res) => {
//     let personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelTitle, personelClinic;
//     //Buradaki verilerin boş olmadığını kabul ediyoruz.
//     ({personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelTitle, personelClinic} = req.body);
//     //console.log("Girdim2!");
//     if(isStrongPassword(personelPassword) == false){
//         console.log("password is not strong enough!");
//         //BURAYA BİR EKRAN YA DA POP UP'IN GELMESİ GEREKİYOR.
//         //res.render("create_dentist_account.ejs", { error: "password is not strong enough!" });

//         //BELKI STATUSCODE 404 DE VERILMELİ BİLEMİYORUM
//         res.status(404);

//         return;
//     }

//     // there is no email verification. Because these datas will be added by admin.
    
//     // Database'e bağlanıyoruz. (Burada database ismi vs değiişmeli!!!)
//     await mongoose.connect("mongodb://localhost:27017/clinicDB", {useNewUrlParser: true});

//     //dentistSchema'ya uyacak bir collection oluşturuyoruz. Eğer PersonelList collection'ı yoksa oluşturuyoruz. (ANCAK KLİNİK MANTIĞINDA DOKTORUN HANGİ KLİNİKTE OLDUĞU BELİRTİLMELİ. YA DA KLİNİK İÇİN BİR COLLECTİON OLUŞTURULUP O COLLECTİON İÇİNE OLUŞTURULAN DOKTORLAR EKLENMELİ.)
//     try {
//         PersonelsList = mongoose.model('PersonelList');
//     } catch {
//         const dentistSchema = new mongoose.Schema({
//           name: String,
//           surname: String,
//           phoneNum: String,
//           email: String,
//           password: String,
//           title: String,
//           clinic: String
//         });
      
//         PersonelsList = mongoose.model('PersonelList', dentistSchema);
//     }    
//     //Burada neden try catch yapısı kullandık? Neden direkt dentistSchema'yı tanımlayıp Dentistlit objesi oluşturmadık? Çünkü eğer PersonelList collection'ı yoksa oluşturuyoruz. Eğer PersonelList collection'ı varsa, direkt PersonelList objesini oluşturuyoruz. Bu yüzden try catch kullandık. Eğer PersonelList collection'ı yoksa, try bloğu çalışacak ve PersonelList objesini oluşturacak. Eğer PersonelList collection'ı varsa, catch bloğu çalışacak ve PersonelList objesini oluşturacak.
//     // Ayrıca try catch içinde yazmasaydım garip bir şekilde password invalid hatasından sonra yeni valid doktor eklemesi yapınca hata alıyordum.

    
//     const personel = new PersonelsList({
//         name: personelName,
//         surname: personelSurname,
//         phoneNum: personelPhoneNum,
//         email: personelEmail,
//         password: personelPassword,
//         title: personelTitle,
//         clinic: personelClinic
        
//     });

//     await personel.save();
    

//     console.log("\nDatabase'e eklendi!");


// });



//this will create new doctor account.
//Warn!!! Burada yetki meselesini de halletmek gerekir. Neticede doktoru herkes ekleyemiyor.
router.post('/create_doctor', async (req, res) => {
    let personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    ({personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic} = req.body);

    await create_account(personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, "Doctor", personelClinic);
});


//this will create new assistant account.
//Warn!!! Burada yetki meselesini de halletmek gerekir. Neticede doktoru herkes ekleyemiyor.
router.post('/create_assistant', async (req, res) => {
    let personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    ({personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic} = req.body);

    await create_account(personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, "Assistant", personelClinic);
});

router.post('/create_admin', async (req, res) => {
    let personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    ({personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic} = req.body);

    await create_account(personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, "Admin", personelClinic);
});


router.post('/create_superadmin', async (req, res) => {
    let personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    ({personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelClinic} = req.body);

    await create_account(personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, "Superadmin", personelClinic);
});




//this will create new personel account. And will add it to database.
router.post('/create_patient', async (req, res) => {
    let name, surname, phoneNum, email, doctor, clinic, date, time, more;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    ({name, surname, phoneNum, email, doctor, clinic, date, time, more} = req.body);
    //console.log("Girdim2!");

    // there is no email verification. Because these datas will be added by person.
    
    // Database'e bağlanıyoruz. (Burada database ismi vs değiişmeli!!!)
    await mongoose.connect("mongodb://localhost:27017/clinicDB", {useNewUrlParser: true});

    //dentistSchema'ya uyacak bir collection oluşturuyoruz. Eğer PersonelList collection'ı yoksa oluşturuyoruz. (ANCAK KLİNİK MANTIĞINDA DOKTORUN HANGİ KLİNİKTE OLDUĞU BELİRTİLMELİ. YA DA KLİNİK İÇİN BİR COLLECTİON OLUŞTURULUP O COLLECTİON İÇİNE OLUŞTURULAN DOKTORLAR EKLENMELİ.)
    try {
        patientList = mongoose.model('patientList');
    } catch {
        const patientSchema = new mongoose.Schema({
          name: String,
          surname: String,
          phoneNum: String,
          email: String,
          doctor: String,
          clinic: String,
          date: String,
          time: String,
          more: String
        });
      
        patientList = mongoose.model('patientList', patientSchema);
    }    
    //Burada neden try catch yapısı kullandık? Neden direkt dentistSchema'yı tanımlayıp Dentistlit objesi oluşturmadık? Çünkü eğer PersonelList collection'ı yoksa oluşturuyoruz. Eğer PersonelList collection'ı varsa, direkt PersonelList objesini oluşturuyoruz. Bu yüzden try catch kullandık. Eğer PersonelList collection'ı yoksa, try bloğu çalışacak ve PersonelList objesini oluşturacak. Eğer PersonelList collection'ı varsa, catch bloğu çalışacak ve PersonelList objesini oluşturacak.
    // Ayrıca try catch içinde yazmasaydım garip bir şekilde password invalid hatasından sonra yeni valid doktor eklemesi yapınca hata alıyordum.

    
    const personel = new patientList({
        name: name,
        surname: surname,
        phoneNum: phoneNum,
        email: email,
        doctor: doctor,
        clinic: clinic,
        date: date,
        time: time,
        more: more
        
    });

    await personel.save();
    

    console.log("\nDatabase'e eklendi!");


});







router.post("/delete_doctor", async (req, res) => {
    const { name, surname, email } = req.body;
  
    if (!name || !surname || !email) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    else{
        delete_account(name, surname, email, 'Doctor');
    }

});


router.post("/delete_assistant", async (req, res) => {
    const { name, surname, email } = req.body;
  
    if (!name || !surname || !email) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    else{
        delete_account(name, surname, email, 'Assistant');
    }

});


router.post("/delete_admin", async (req, res) => {
    const { name, surname, email } = req.body;
  
    if (!name || !surname || !email) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    else{
        delete_account(name, surname, email, 'Admin');
    }

});



router.post("/delete_superadmin", async (req, res) => {
    const { name, surname, email } = req.body;
  
    if (!name || !surname || !email) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    else{
        delete_account(name, surname, email, 'Superadmin');
    }

});


//Warn!!! Hasta ekle sil mantıksız geldi. O yüzden randevu ekle sil mantığıyla yapıyorum.
router.post('/delete_patient', async (req, res) => {
    let name, surname, phoneNum, email, doctor, clinic, date, time, more;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    //Çarpı butonuna basılarak randevu iptal ediliyor. O halde o kısımdaki tüm bilgilerin input olarak alındığını kabul ediyorum. Sonradan değiştirebiliriz. 
    ({name, surname, phoneNum, email, doctor, clinic, date, time, more} = req.body);


    const dbName = 'clinicDB';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      console.log('Connected to MongoDB in delete_patient');
  
      const db = client.db(dbName);
      const collection = db.collection('patientlists');

  
      // Delete documents where name, surname, email, and title match the provided values
      const result = await collection.deleteMany({ name: name, surname: surname, phoneNum: phoneNum, date: date, time:time });
  
      console.log(`Removed ${result.deletedCount} documents with name ${name}, surname ${surname}, and phoneNum ${phoneNum}`);
    } catch (error) {
      console.error('Error deleting documents:', error);
    } finally {
      await client.close();
      console.log('Disconnected from MongoDB in delete_patient');
    }    

});




//this will create new personel account. And will add it to database.
async function create_account(personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelTitle, personelClinic){
    //let personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelTitle, personelClinic;
    //Buradaki verilerin boş olmadığını kabul ediyoruz.
    //({personelName, personelSurname, personelPhoneNum, personelEmail, personelPassword, personelTitle, personelClinic} = req.body);
    //console.log("Girdim2!");
    if(isStrongPassword(personelPassword) == false){
        console.log("password is not strong enough!");
        //BURAYA BİR EKRAN YA DA POP UP'IN GELMESİ GEREKİYOR.
        //res.render("create_dentist_account.ejs", { error: "password is not strong enough!" });

        //BELKI STATUSCODE 404 DE VERILMELİ BİLEMİYORUM
        //res.status(404);

        return;
    }

    // there is no email verification. Because these datas will be added by admin.
    
    // Database'e bağlanıyoruz. (Burada database ismi vs değiişmeli!!!)
    await mongoose.connect("mongodb://localhost:27017/clinicDB", {useNewUrlParser: true});

    //dentistSchema'ya uyacak bir collection oluşturuyoruz. Eğer PersonelList collection'ı yoksa oluşturuyoruz. (ANCAK KLİNİK MANTIĞINDA DOKTORUN HANGİ KLİNİKTE OLDUĞU BELİRTİLMELİ. YA DA KLİNİK İÇİN BİR COLLECTİON OLUŞTURULUP O COLLECTİON İÇİNE OLUŞTURULAN DOKTORLAR EKLENMELİ.)
    try {
        PersonelsList = mongoose.model('PersonelList');
    } catch {
        const dentistSchema = new mongoose.Schema({
          name: String,
          surname: String,
          phoneNum: String,
          email: String,
          password: String,
          title: String,
          clinic: String
        });
      
        PersonelsList = mongoose.model('PersonelList', dentistSchema);
    }    
    //Burada neden try catch yapısı kullandık? Neden direkt dentistSchema'yı tanımlayıp Dentistlit objesi oluşturmadık? Çünkü eğer PersonelList collection'ı yoksa oluşturuyoruz. Eğer PersonelList collection'ı varsa, direkt PersonelList objesini oluşturuyoruz. Bu yüzden try catch kullandık. Eğer PersonelList collection'ı yoksa, try bloğu çalışacak ve PersonelList objesini oluşturacak. Eğer PersonelList collection'ı varsa, catch bloğu çalışacak ve PersonelList objesini oluşturacak.
    // Ayrıca try catch içinde yazmasaydım garip bir şekilde password invalid hatasından sonra yeni valid doktor eklemesi yapınca hata alıyordum.

    
    const personel = new PersonelsList({
        name: personelName,
        surname: personelSurname,
        phoneNum: personelPhoneNum,
        email: personelEmail,
        password: personelPassword,
        title: personelTitle,
        clinic: personelClinic
        
    });

    await personel.save();
    

    console.log("\nDatabase'e eklendi!");   
}





// Function to delete doctor documents
async function delete_account(name, surname, email, title) {

    const dbName = 'clinicDB';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
      await client.connect();
      console.log('Connected to MongoDB');
  
      const db = client.db(dbName);
      const collection = db.collection('personellists');

  
      // Delete documents where name, surname, email, and title match the provided values
      const result = await collection.deleteMany({ name: name, surname: surname, email: email, title: title });
  
      console.log(`Removed ${result.deletedCount} documents with name ${name}, surname ${surname}, email ${email}, and title ${title}`);
    } catch (error) {
      console.error('Error deleting documents:', error);
    } finally {
      await client.close();
      console.log('Disconnected from MongoDB in delete_account');
    }
}




function isStrongPassword(password) {
    // Define a regular expression pattern for a strong password
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  
    // Test the password against the pattern
    return strongPasswordRegex.test(password);
} 


module.exports = router;