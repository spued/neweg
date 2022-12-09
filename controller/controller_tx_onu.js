const db = require('../model');
const logger = require('../lib/logger');

function parseNRSSP(nrssp) {
    var res = nrssp.split('-');
    return res;
}

const post_tx_onu_count = async (req, res) => {
    logger.info("Controller : get TX onu count prefix = " + req.body.prefix);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default',
        data: []
    };
    if(req.body.prefix == '') res.json(resData);
    
    let _data = {
        master_id : 0, 
        prefix : req.body.prefix
    }
    db.getTXONUCount(_data).then(function(rows) {
        //console.log(rows);
        resData.data = rows;
        resData.rowCount = rows.length;
        resData.code = 0;
        resData.msg = 'OK';
        res.json(resData);
    }).catch((err) => setImmediate(() => { throw err; }));
}
const post_tx_nc_onu = async (req, res) => {
    logger.info("Controller : get TX onu NC count prefix = " + req.body.prefix);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default',
        data: []
    };
    if(req.body.prefix == '')  {
        res.json(resData);
    } else {
        let _data = {
            master_id : 0, 
            prefix : req.body.prefix
        }
        db.get_TX_NC_ONU_data(_data).then(function(rows) {
            //console.log(rows);
            resData.data = rows;
            resData.rowCount = rows.length;
            resData.code = 0;
            resData.msg = 'OK';
            res.json(resData);
        }).catch((err) => setImmediate(() => { throw err; }));
    }
   
}
module.exports = {
    post_tx_onu_count,
    post_tx_nc_onu
}