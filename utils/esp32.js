const { espData, updateEspData, espConfigData } = require("../db/espData");
const { sendError } = require("./helper");
const ConfigureData = require('../model/configureData');
const SupplyList = require("../model/supplyList");

// sets the sensor data to the data given by esp
exports.setSensorData = async (req, res) => {
    try {
        const sensorData = req.body;
        Object.entries(sensorData).forEach((e) => { if (espData[e[0]] !== undefined) { espData[e[0]] = e[1] } });
        console.log("setEspData: ", espData);
        //console.log("espData: ",espData);

        if (!sensorData.motorOn && sensorData.tankFull) {
            updateEspData.motorOn = false;
        }
        res.json({ msg: "Sensor data recieved", udata: updateEspData });
        // checks if the water passed or esp configuration data has to be updated
        // after sending it one time it is marked as no data to update
        if (updateEspData.resetWater) {
            updateEspData.resetWater = false;
        }
        if(updateEspData.updateConfigData){
            updateEspData.updateConfigData= false;
        }
    } catch (error) {
        console.log(error);
        sendError(res,"Failed to set Data");
    }
}

let skiptime = 0;
// sends the local server data to frontend
exports.getSensorData = async (req, res) => {
    try {
        // checks if the data is updated
        if (espData.buildLed !== updateEspData.buildLed) {
            if (skiptime < 2) {
                espData.buildLed = updateEspData.buildLed;
            } else {
                // if data is not updated after 2 calls then updated data is changed to what we have
                updateEspData.buildLed = espData.buildLed;
            }
            skiptime++
        } else if (espData.motorOn !== updateEspData.motorOn) {
            if (skiptime < 2) {
                espData.motorOn = updateEspData.motorOn;
            } else {
                updateEspData.motorOn = espData.motorOn;
            }
            skiptime++
        } else {
            skiptime = 0;
        }
        console.log("getEspData: ", espData);
        res.json({ data: espData, status: 'ok' })
    } catch (error) {
        console.log(error);
        sendError(res,"failed yo get esp data");
    }
}

// update the local esp configuration data on server
exports.setEspConfigData = async (req, res) => {
    try {
        const configData = req.body.configData;
        Object.entries(configData).forEach((e) => {
            if (espConfigData[e[0]] !== undefined) { espConfigData[e[0]] = e[1] } });
        console.log("espConfigData: ", espConfigData);
        //console.log("espConfigData: ",espConfigData);
        await updateEspConfigData(req.userID)
        res.json({ msg: "config data recieved"});
    } catch (error) {
        console.log(error);
        sendError(res,"Failed to set Data");
    }
}

// sends the esp configuration data
exports.getEspConfigData = async (req, res) => {
    try {
        console.log("espConfigData: ", espConfigData);
         //console.log("espConfigData: ",espConfigData);
         res.json({udata: espConfigData ,status:"ok"});
     } catch (error) {
         console.log(error);
         sendError(res,"Failed to set Data");
     }
}

// update the configuration data on the database
const updateEspConfigData = async (userID) => {
    if(!userID){
        return sendError("User not found");
    }
    const config = await ConfigureData.findOne({owner:userID});
    if(config){
        config.updateData(espConfigData);
    }else{
        const {tankDepth,maxFill} = espConfigData;
        const newConfig = new ConfigureData({owner:userID,tankDepth,maxFill});
        newConfig.save();
    }
}

// update the local esp config data with the database data
exports.fetchEspConfigData = async (req, res) => {
    try {
        const userID= req.userID;
        if(!userID){
            return sendError("User not found");
        }
        const config = await ConfigureData.findOne({owner:userID});
        if(config){
            espConfigData.tankDepth= config.tankDepth;
            espConfigData.maxFill= config.maxFill;
        }
        res.json({ msg:"esp config data fetched", status: 'ok' })
    } catch (error) {
        console.log(error);
        sendError(res,"failed to fetch esp config data");
    }
}

// set the updated local esp data with te given data
exports.updateSensorData = async (req, res) => {
    try {
        const { buildLed, motorOn, resetWater,updateConfigData} = req.body.data;
        // console.log(sensorData.buildLed);
        if (buildLed !== undefined) {
            espData.buildLed = buildLed;
            updateEspData.buildLed = buildLed;
        }
        if (motorOn !== undefined) {
            espData.motorOn = motorOn;
            updateEspData.motorOn = motorOn;
        }
        if (resetWater !== undefined) {
            updateEspData.resetWater = resetWater;
        }if(updateConfigData!= undefined){
            updateEspData.updateConfigData= updateConfigData;
        }
        console.log('updated data: ', updateEspData);
        res.json({ msg: "Sensor data updated", status: 'ok' })
    } catch (error) {
        console.log(error);
        sendError(res,"Failed to update sensor data");
    }
}

// save the supply list to database
exports.saveSupplyList = async (req, res) => {
    try {
        let list = req.body.supplyList;
        // list = list.map((e)=>{
        //     return(
        //         {
        //             room:e.room,
        //             name:e.name,
        //             supplyOn:e.supplyOn

        //         }
        //     )
        // })
        console.log("List "+list);
        const userID= req.userID;
        if(!userID){
            return sendError("User not found");
        }
        let slist = await SupplyList.findOne({owner:userID});
        if(slist){
            slist.updateList(userID,list);
        }else{
            slist= new SupplyList({owner:userID,roomList:list});
            slist.save();
        }
        console.log("SupplyList Updated.");
        console.log(slist);
        res.json({ msg: "Supply List  updated", status: 'ok' })
    } catch (error) {
        console.log(error);
        sendError(res,"Failed to update sensor data");
    }
}

// gets the supply list from the database
exports.getSupplyList = async (req, res) => {
    try {
        const userID= req.userID;
        console.log(userID);
        if(!userID){
            return sendError("User not found");
        }
        let slist = await SupplyList.findOne({owner:userID});
        if(slist){
            res.json({ supplyList: slist, status: 'ok' })
            console.log("Got SupplyList");
        }else{
            res.json({ msg: "Supply List not found!", status: 'ok' })
            console.log(slist)
        }
    } catch (error) {
        console.log(error);
        sendError(res,"Failed to update sensor data");
    }
}

exports.deleteSupplyList = async (req, res) => {
    try{
        const {id} = req.params;

        const deleteuser =await SupplyList.findByIdAndDelete({_id:id})
        console.log(deleteuser);
        res.status(201).json(deleteuser);

    }catch (error){
        res.status(422).json(error);
    }
}

