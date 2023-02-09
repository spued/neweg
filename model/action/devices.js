const { DbNoResult } = require('../../errors');
const { User, Sessions, Logs, Devices } = require('../core/Schemas');
const ObjectId = require('mongoose').Types.ObjectId; 

async function listDevices(data) {
    const res = await Devices.findOne(data);
    //console.log(res);
    return res;
}

async function countAllDevices(data) {
    const res = await Devices.countDocuments();
    //console.log(res);
    return res;
}

module.exports = {
    listDevices,
    countAllDevices
}