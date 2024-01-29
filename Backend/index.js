const express = require("express");
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// Import dotenv to use environment variables
require('dotenv').config();

// initializing firebase
const admin = require('firebase-admin');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require("./chainquests-firebase-adminsdk-xqkvw-70590c52d4.json");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'chainquests.appspot.com'
});
  
const bucket = getStorage().bucket();
const storage = multer.memoryStorage();

const db = getFirestore();

const app = express();
const port = process.env.PORT || 3300;

// Enable CORS for any origin
app.use(cors({
    origin: '*', // Allow requests from any origin
    credentials: true, // Include if you're using credentials (e.g., cookies, authorization headers)
}));
  
app.use(express.json());

const startServer = async () => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Example app listening on port ${port}`);
    });
};

app.get("/", (req, res) => {
    res.send("Hello World!");
});
  
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
}).single('file');

app.post("/uploadImage", async (req, res) => {
    let fileURL;
    upload(req, res, async (err) => {
      if (err) {
        console.error('error uploading file:', err);
        res.status(500).json({ error: err.message });
      } else {
        if (!req.file) {
          res.status(400).json({ error: 'No file uploaded' });
        } else {
          try {
            const file = req.file;
            const fileName = file.originalname;
  
            const fileUpload = bucket.file(fileName);
  
            const fileStream = fileUpload.createWriteStream({
              metadata: {
                contentType: file.mimetype
              }
            });

            fileStream.on('error', (error) => {
              console.error('Error uploading to Firebase:', error);
              res.status(500).json({ error: 'Error uploading to Firebase' });
            });

            fileStream.on('finish', () => {
              fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;
              console.log('File uploaded to Firebase. Download URL:', fileURL);
              res.status(200).json({ response: 'File uploaded successfully', url: fileURL });
            });
  
            fileStream.end(file.buffer);
          } catch (error) {
            console.error('Error uploading file:', error);
            res.status(500).json({ error: 'Error uploading file' });
          }
        }
      }
    });
});

app.post("/createGiveaway", async (req, res) => {
    try {
      const giveawayRef = db.collection('giveaways');
      const giveawayDetailRef = db.collection('giveawayDetails');

      const _count = await giveawayDetailRef.doc('details').get();
      const count = _count.data().count;
      const newCount = count + 1;
      
      await giveawayRef.doc(`${count}`).set(req.body);
      await giveawayDetailRef.doc('details').update({ count: newCount });

      res.status(200).json({ response: "successful"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
})

app.post("/createAirdrop", async (req, res) => {
    try {
      const airdropRef = db.collection('airdrops');
      const airdropDetailRef = db.collection('airdropDetails');
  
      const _count = await giveawayDetailRef.doc('details').get();
      const count = _count.data().count;
      const newCount = count + 1;
      
      await airdropRef.doc(`${count}`).set(req.body);
      await airdropDetailRef.doc('details').update({ count: newCount });

      res.status(200).json({ response: "successful"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
})

app.get("/getAllGiveaways:address", async (req, res) => {  
    
    const address = req.params.address;

    try {
      const giveaways = db.collection('giveaways');
      const allgiveaways = await giveaways.get();
      const giveawayArray = [];
      const giveawaysCount = allgiveaways.size;
  
      for (let i = 0; i < giveawaysCount; i++) {
        const giveaway = await giveaways.doc(`${i}`).get();
        const title = giveaway.data().title;
        const description = giveaway.data().description;
        const imageUrl = giveaway.data().imageUrl;
        const giveawayAmount = giveaway.data().giveawayAmount;
        const remainingAmount = giveaway.data().remainingAmount;
        const id = i;
        const creator = giveaway.data().creator;

        const giveawayDetails = {};
        const value = {}
        value.id = id;
        value.title = title;
        value.host = creator;
        // value.hostImage = static image
        value.giveawayImage = imageUrl;
        value.description = description;

        value.time = {
          start: giveaway.data().startDate,
          end: giveaway.data().endDate
        };
        value.quantity = {
          total: giveawayAmount,
          remaining: remainingAmount
        }
        
        var claimed;
        const questerRef = db.collection('giveaways').doc(`${i}`).collection('questers');
        const questerSnapshot = await questerRef.where('address', '==', address).get();
        if (questerSnapshot.empty) {
          claimed = false;
        } else {
          claimed = questerSnapshot.docs[0].data().claimed;
        }

        const _isCreator = await isCreator(`${i}`, address);
        
        value.claimed = claimed;
        value.isCreator = _isCreator;
  
        giveawayDetails.id = id;
        giveawayDetails.value = value;
  
        giveawayArray.push(giveawayDetails);
      }
  
      res.status(200);
      res.json(giveawayArray);
    
    } catch (error) {
      console.log(error);
      res.status(500);
      res.json({ error: error.message });
    }
  
})

app.get("/getAllAirdrops:address", async (req, res) => {  
    
    const address = req.params.address;
    
    try {
      const airdrops = db.collection('airdrops');
      const allairdrops = await airdrops.get();
      const airdropArray = [];
      const airdropsCount = allairdrops.size;
  
      for (let i = 0; i < airdropsCount; i++) {
        const airdrop = await airdrops.doc(`${i}`).get();
        const title = airdrop.data().title;
        const description = airdrop.data().description;
        const imageUrl = airdrop.data().imageUrl;
        const airdropAmount = airdrop.data().airdropAmount;
        const remainingAmount = airdrop.data().remainingAmount;
        const tokenAddress = airdrop.tokenAddress;
        const id = i;
        const creator = airdrop.data().creator;

        const airdropDetails = {};
        const value = {}
        value.id = id;
        value.title = title;
        value.host = creator;
        value.tokenAddress = tokenAddress;
        // value.hostImage = static image
        value.airdropImage = imageUrl;
        value.description = description;

        value.time = {
          start: airdrop.data().startDate,
          end: airdrop.data().endDate
        };
        value.quantity = {
          total: airdropAmount,
          remaining: remainingAmount
        }
        
        var claimed;
        const questerRef = db.collection('airdrops').doc(`${i}`).collection('questers');
        const questerSnapshot = await questerRef.where('address', '==', address).get();
        if (questerSnapshot.empty) {
          claimed = false;
        } else {
          claimed = questerSnapshot.docs[0].data().claimed;
        }

        const _isCreator = await isCreator(`${i}`, address);
        
        value.claimed = claimed;
        value.isCreator = _isCreator;
  
        airdropDetails.id = id;
        airdropDetails.value = value;
  
        airdropArray.push(airdropDetails);
      }
  
      res.status(200);
      res.json(airdropArray);
    
    } catch (error) {
      console.log(error);
      res.status(500);
      res.json({ error: error.message });
    }
  
})

app.get("/claimGiveaway:giveawayId", async (req, res) => {
    try {
        const giveawayId = req.params.giveawayId;
        const address = req.body.address;
        const amount = req.body.amount;
    
        const giveawayRef = await db.collection('giveaways').doc(giveawayId).get();
        const giveawayDoc = giveawayRef.data();
        const remainingAmount = giveawayDoc.remainingAmount;
    
        const newAmount = remainingAmount - amount;
    
        const questerObj = {
            address: address,
            claimed: true
        }
    
        const questerRef = db.collection('giveaways').doc(giveawayId).collection('questers');
        await questerRef.add(questerObj);

        await db.collection('giveaways').doc(giveawayId).update({ remainingAmount: newAmount });
    
        res.status(200).json({ response: "successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

})

app.get("/claimAirdrop:airdropId", async (req, res) => {
    try {
        const airdropId = req.params.airdropId;
        const address = req.body.address;
        const amount = req.body.amount;

        const airdropRef = await db.collection('airdrops').doc(airdropId).get();
        const airdropDoc = airdropRef.data();
        const remainingAmount = airdropDoc.remainingAmount;
    
        const newAmount = remainingAmount - amount;
    
        const questerObj = {
            address: address,
            claimed: true
        }

        const questerRef = db.collection('airdrops').doc(airdropId).collection('questers');
        await questerRef.add(questerObj);

        await db.collection('airdrops').doc(airdropId).update({ remainingAmount: newAmount });
    
        res.status(200).json({ response: "successful"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

})

const isCreator = async(id, address) => {
    try {
      const giveawayRef = db.collection('giveaways').doc(`${id}`);
      const giveawayDoc = await giveawayRef.get();
      if (!giveawayDoc.exists) {
        return false;
      }
      const creator = giveawayDoc.data().creator;
  
      if (creator == address) {
        return true;
      }
  
      else {
        return false;
      }
  
    } catch (error) {
      console.log(error);
    }
}

// Call startServer()
startServer();

// app.js file
// call endpoints
// call smart contract functions