import Student from "../../models/Student";
import express from 'express';
import TimeTable from "../../models/TimeTable";
import mongoose from 'mongoose';
//import { check, validationResult } from "express-validator";
const router = express.Router();


let ObjectId = mongoose.Types.ObjectId; 
router.get("/shareTT",async (req, res) => {
    let branch = req.query.branch;
    let year = req.query.year;
    if(year === undefined || isNaN(year))
    {
       
        res.send(null);
    }
    else{
    year = parseInt(year);
    console.log(year);
    let StudentIDs = [];
    await Student.find({'branch': branch, 'year': year }, (err, docs) => {
        console.log(branch);
        //console.log(docs[0]["_id"]);
        let ownerIDList = [];
        for (let doc of docs) {
            ownerIDList.push(doc["_id"]);
        }
        //console.log(ownerIDList);
        StudentIDs = JSON.parse(JSON.stringify(ownerIDList));
    }

    );
    console.log("hi");
    console.log(StudentIDs);
    if (StudentIDs == null) {
        console.log("m8, null");
        res.send(null);
    }
    else {
        let ownerIds = [];
        StudentIDs.forEach(item => {
            ownerIds.push(new ObjectId(item));
        })
        let TTData = [];
        await TimeTable.find({ownerId: {$in: ownerIds}},(err,docs)=>
        {
            console.log(docs);
            let TTList = [];
            for(let TT of docs)
            {
                TTList.push(TT);
            }
            TTData = JSON.parse(JSON.stringify(TTList));
            
        });
        console.log(TTData);
        res.json(TTData);
    }
}
}
);

module.exports = router;