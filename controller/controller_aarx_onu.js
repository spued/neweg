const db = require('../model');
const logger = require('../lib/logger');

function parseNRSSP(nrssp) {
    var res = nrssp.split('-');
    return res;
}

const post_rx_province = async (req, res) => {
    logger.info("Controller : province list rx onu = " + req.body.prefix);
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    db.get_PON_data_by_prefix(req.body.prefix.trim()).then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}
const post_masters_info = async (req, res) => {
    logger.info("Controller : get all master list");
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    db.getOverAllMasterData().then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}
const post_list_master_id = async (req, res) => {
    logger.info("Controller : get master id list for prefix = " + req.body.prefix);
    resData = {
        code : 1,
        msg : 'Error : Default',
        data : []
    }; 
    if(req.body.prefix == 'default') {
        return res.json(resData);
    } else {
        db.getActiveMasterIDByPrefix(req.body.prefix.trim()).then(function(rows) {
            //console.log(rows);
            resData.data = rows;
            resData.rowCount = rows.length;
            resData.code = 0;
            resData.msg = 'OK';
            res.json(resData);
        }).catch((err) => setImmediate(() => { throw err; }));
    }
}
const post_count_pon = async (req, res) => {
    logger.info("Controller : get pon count for master id = " + req.body.master_id);
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    db.countPONByMasterID(req.body.master_id, req.body.prefix).then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}
const post_rx_onu_count = async (req, res) => {
    logger.info("Controller : get onu count for prefix = " + req.body.prefix);
    resData = {
        code : 1,
        msg : 'Error : Default',
        data : []
    };
    if(req.body.prefix == 'default') {
        res.json(resData);
    } else {
        let _data = {
            master_id : req.body.master_id, 
            prefix : req.body.prefix.trim()
        }
        db.getRXONUCount(_data).then(function(rows) {
            //console.log(rows);
            resData.data = rows;
            resData.rowCount = rows.length;
            resData.code = 0;
            resData.msg = 'OK';
            res.json(resData);
        }).catch((err) => setImmediate(() => { throw err; }));
    }
}
const post_rx_pon_count = async (req, res) => {
    logger.info("Controller : get RX pon count for prefix = " + req.body.prefix);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    let _data = {
        master_id : req.body.master_id, 
        prefix : req.body.prefix
    }
    db.get_RX_ONU_data(_data).then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}

const post_pon_onu = async (req, res) => {
    logger.info("Controller : get pon onu list for NRSSP = " + req.body.nrssp);
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    //console.log(req.body);
    let master_id_list = JSON.parse(req.body.master_id);
    let nrssp = parseNRSSP(req.body.nrssp);
    let _data = {
        ne_name : nrssp[0], 
        rack : nrssp[1],
        shelf : nrssp[2],
        slot : nrssp[3],
        port : nrssp[4],
        master_id: master_id_list
    }
    //console.log(_data);
    db.get_PON_ONU_RX_data(_data).then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}

const post_list_nc_onu = async (req, res) => {
    logger.info("Controller : get list nc onu for prefix = " + req.body.prefix);
    resData = {
        code : 1,
        msg : 'Error : Default'
    };
    db.get_NC_ONU_data(req.body).then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}

const post_list_nc_history = async (req, res) => {
    logger.info("Controller : get list nc history for prefix = " + req.body.prefix);
    resData = {
        code : 1,
        msg : 'Error : Default',
        data : []
    };
    db.getCountNCONUData(req.body).then(function(rows) {
        //console.log(rows);
        resData.data.push(rows);
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}
module.exports = {
    post_rx_province,
    post_masters_info,
    post_list_master_id,
    post_count_pon,
    post_rx_onu_count,
    post_rx_pon_count,
    post_pon_onu,
    post_list_nc_onu,
    post_list_nc_history
}