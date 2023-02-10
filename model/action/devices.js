const { DbNoResult } = require('../../errors');
const { Devices } = require('../core/Schemas');
const ObjectId = require('mongoose').Types.ObjectId; 

async function listDevices(data) {
    const res = await Devices.findOne(data);
    //console.log(res);
    return res;
}

async function countAllDevices(data) {
    let res = undefined;
    res = await Devices.countDocuments(data);
    //console.log(res);
    return res;
}

module.exports = {
    listDevices,
    countAllDevices
}