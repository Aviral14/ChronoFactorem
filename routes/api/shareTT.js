import Student from "../../models/Student";
import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
import TimeTable from "../../models/TimeTable";

router.get("/shareTT/", async (req, res) => {
    let [branch, year] = req.query;
    let StudentIDs = [];
    await Student.find({ 'branch': branch, 'year': year }, (err, docs) => {

        let ownerIDList = [];
        for (let doc of docs) {
            ownerIDList.push(doc.ownerID);
        }
        StudentIDs = JSON.parse(JSON.stringify(ownerIDList)).default;
    }

    );
    if (StudentIDs == null) {
        res.send(null);
    }
    else {
        const TTData = [];
        await TimeTable.find({ownerID: {$in: StudentIDs}},(err,docs)=>
        {
            let TTList = [];
            for(let TT of docs)
            {
                TTList.push(TT);
            }
            TTData = JSON.parse(JSON.stringify(TTList)).default;
        });
        res.json(TTData);
    }
}
);

module.exports = router;