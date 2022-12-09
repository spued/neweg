const e = require('express');
const logger = require('../../lib/logger');
var db_conn = require('../core/data_connection');

function getOverAllNEData(data) {
    let sql = "SELECT NE_Name,count(*) AS ne_count FROM aarx_status WHERE status = 1 " + 
    "AND NE_name REGEXP '" + data
    + "' GROUP BY substr(NE_Name, 1,3)";
    return new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows);
            resolve(rows);
        });
    });
}
function getDataByPrefix(prefix) {
    let sql = "SELECT count(*) AS ne_count FROM aarx_status WHERE status = 1 AND NE_Name LIKE '"+ prefix + "%'";
    //console.log(sql);
    return new Promise(function(resolve, reject) {
            db_conn.query(sql, function (err, rows, fields) {
                if (err) throw err;
                resolve(rows);
            });
    }); 
}
function get_PON_data_by_prefix(prefix) {
    let sql = "SELECT NE_Name,count(*) AS ne_count FROM aarx_status WHERE status = 1 AND NE_Name LIKE '"+ prefix + "%' GROUP BY NE_Name";
    //console.log(sql);
    return new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}
function getMasterIDByPrefix(prefix) {
    let sql = "SELECT master_id,count(*) AS master_count FROM aarx_status WHERE status = 1 AND NE_Name LIKE '"+ prefix + "%' GROUP BY master_id ORDER BY create_at DESC";
    //console.log(sql);
    return new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}
function getOverAllMasterData() {
    let sql = "SELECT * FROM aarx_master WHERE status = 1 OR status = 2";
    //console.log(db_conn);
    return new Promise(function(resolve, reject) {
            db_conn.query(sql, function (err, rows, fields) {
                if (err) throw err;
                resolve(rows);
            });
    });      
}
function getActiveMasterIDByPrefix(prefix) {
    // get active master id by status status 0 = last, 1 = previous
    // get all master id that use by those prefix
    let sql = "SELECT master_id,count(*) AS master_count FROM aarx_status WHERE status = 1 AND NE_Name LIKE '"+ prefix + "%' GROUP BY master_id ORDER BY create_at DESC";
    // get all master prefix that has status 0 or 1
    let sql_1 = "SELECT * FROM aarx_master WHERE status = 1 ORDER BY created_at DESC";
    let sql_2 = "SELECT NE_Name,count(*) AS pon_count FROM aarx_status WHERE status = 1 AND NE_Name LIKE '"+ prefix + "%' GROUP BY NE_Name";
    //console.log(sql);

    let master_ids =  new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    let active_ids = new Promise(function(resolve, reject) {
        db_conn.query(sql_1, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    let pons = new Promise(function(resolve, reject) {
        db_conn.query(sql_2, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    return Promise.all([master_ids, active_ids, pons]).then((results) => {
        //console.log(results[0]);
        let ids = [];
        let last_master = [results[0][0]];
        if(results[0][1] != undefined) last_master.push(results[0][1]);
        //console.log(last_master);
        results[1].forEach((item) => {
            if(last_master.find((ele) => {
                return ele.master_id == item.id;
            })) {
                ids.push(item);
            }
        });
        return ids;
    });
}
function countPONByMasterID(master_id, prefix) {
    let sql = "SELECT master_id,count(*) AS pon_count FROM import_data WHERE NE_Name LIKE '"+ prefix +
     "%' AND master_id = "+ master_id +" GROUP BY master_id";
    //console.log(sql);
    return new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
}
function getTXONUCount(data) {
    return new Promise(function(resolve, reject) {
        let sql = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') AS dates FROM aarx_status WHERE NE_Name LIKE '"
            + data.prefix + 
            "%' GROUP BY DATE_FORMAT(create_at, '%y-%m-%d') ORDER BY YEAR(create_at) DESC, MONTH(create_at) DESC, DAYOFMONTH(create_at) DESC";
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows[0].dates);
            let curr_date = rows[0].dates;
            // get all master id that use by those prefix
            let sql_1 = "SELECT * FROM import_data WHERE NE_Name LIKE '"+ data.prefix + 
                "%' AND start_at LIKE '"+ curr_date + "%'";
            //console.log(sql_1);
            db_conn.query(sql_1, function (err, _rows, fields) {
                if (err) throw err;
                let good = bad = 0;
                let onu_count = {
                    good : 0,
                    bad : 0
                };
                _rows.forEach((onu) => {
                    if (onu.Transmitted_Optical_Power != '--') {
                        if(onu.Transmitted_Optical_Power < 2) {
                            //console.log('This is bad');
                            bad++;
                        } else {
                            //console.log('This is Good');
                            good++;
                        }
                    }
                })
                onu_count.good = good;
                onu_count.bad = bad;
                console.log("onu TX count result for " + data.prefix + " " + JSON.stringify(onu_count));
                resolve(onu_count);
            });
        });
    });
}
function get_TX_NC_ONU_data(data) {
    return new Promise(function(resolve, reject) {
        let sql = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') AS dates FROM aarx_status WHERE NE_Name LIKE '"
            + data.prefix + 
            "%' GROUP BY DATE_FORMAT(create_at, '%y-%m-%d') ORDER BY YEAR(create_at) DESC, MONTH(create_at) DESC, DAYOFMONTH(create_at) DESC";
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows[0].dates);
            let curr_date = rows[0].dates;
            // get all master id that use by those prefix
            let sql_1 = "SELECT * FROM import_data WHERE NE_Name LIKE '"+ data.prefix + 
                "%' AND start_at LIKE '"+ curr_date + "%' AND Transmitted_Optical_Power < 2 AND NOT Transmitted_Optical_Power = '--'";
            //console.log(sql_1);
            db_conn.query(sql_1, function (err, _rows, fields) {
                if (err) throw err;
                resolve(_rows);
            });
        });
    });
}
function getRXONUCount(data) {
    return new Promise(function(resolve, reject) {
        let sql_0 = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') AS dates FROM aarx_status WHERE NE_Name LIKE '"
            + data.prefix.trim() + 
            "%' GROUP BY DATE_FORMAT(create_at, '%y-%m-%d') ORDER BY YEAR(create_at) DESC, MONTH(create_at) DESC, DAYOFMONTH(create_at) DESC";
        //console.log(sql_0)
        db_conn.query(sql_0, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows[0]);
            let curr_date = rows[0].dates;
            // get all master id that use by those prefix
            let sql_1 = "SELECT * FROM aarx_status WHERE NE_Name LIKE '"+ data.prefix + "%' AND status = 1";
            // get all master id that use by those prefix
            let sql_2 = "SELECT * FROM import_data WHERE start_at LIKE '"+ curr_date + "%' AND NE_Name LIKE '"+ data.prefix + "%'";
            //console.log(sql);
            
            let pons=  new Promise(function(resolve, reject) {
                db_conn.query(sql_1, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows);
                });
            });
            let onus =  new Promise(function(resolve, reject) {
                db_conn.query(sql_2, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows);
                });
            });
            return Promise.all([pons, onus]).then((res) => {
                //console.log(res);
                let pon_data = res[0];
                let onu_data = res[1];
                let NRSSP = '';
                let AARX_Power = 0;
                let good = bad = 0;
                let onu_count = {
                    good : 0,
                    bad : 0
                };
                console.log('Get qty for onu = ' + onu_data.length);
                console.log('Get qty for pon = ' + pon_data.length);
                onu_data.forEach((onu) => {
                    if(onu.Received_Optical_Power != '--') {
                        NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                        AARX_Power = pon_data.find((pon_item) => {
                            return pon_item.NRSSP == NRSSP;
                        })
                        if(AARX_Power.aarx != 0) {
                            //console.log("NRSSP = " + NRSSP + " Get AARX = " + AARX_Power.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                            //console.log(' = ' + (onu.Received_Optical_Power - AARX_Power.aarx));
                            if((onu.Received_Optical_Power - AARX_Power.aarx) < (-2)) {
                                //console.log('This is bad');
                                //console.log(onu.Name + ' Bad  = ' + (onu.Received_Optical_Power - AARX_Power.aarx));
                                bad++;
                            } else {
                                //console.log('This is Good');
                                good++;
                            }
                        } else {
                            //console.log('A@RX = 0!');
                        }
                        
                    } else {
                        //console.log('this is --');
                    }
                })
                onu_count.good = good;
                onu_count.bad = bad;
                console.log("onu RX result for " + data.prefix + " " + JSON.stringify(onu_count));
                resolve(onu_count);;
            });
        });
    });
}
function _getRXONUData(data) {
    //console.log(data);
    // get all master prefix that has status active == 0 or previous == 1
    let sql = "SELECT * FROM aarx_master WHERE id = " + data.master_id;
    let sql_1 = "SELECT * FROM aarx_status WHERE status = 1 AND master_id = "+ data.master_id + " AND NE_Name LIKE '"+ data.prefix + "%'";
    // get all master id that use by those prefix
    let sql_2 = "SELECT * FROM import_data WHERE master_id = "+ data.master_id + " AND NE_Name LIKE '"+ data.prefix + "%'";
    
    let master_data =  new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    let pons=  new Promise(function(resolve, reject) {
        db_conn.query(sql_1, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    let onus =  new Promise(function(resolve, reject) {
        db_conn.query(sql_2, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    return Promise.all([master_data, pons, onus]).then((res) => {
        //console.log(res);
        let onu_data = res[2];
        let pon_data = res[1];
        let NRSSP = '';
        let good = bad = 0;
        let onu_count = [];

        pon_data.forEach(pon => {
            good = 0; 
            bad = 0;
            onu_data.forEach((onu) => {
                NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                if(NRSSP == pon.NRSSP) {
                    //console.log("NRSSP = " + NRSSP + " Get AARX = " + AARX_Power.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                    if((onu.Received_Optical_Power - pon.aarx) < (-2)) {
                        //console.log('This is bad');
                        bad++;
                    } else {
                        //console.log('This is Good');
                        good++;
                    }
                }
            })
            onu_count.push( { 
                pon_name : pon.NRSSP,
                pon_aarx : pon.aarx,
                good: good,
                bad: bad
            });
        })
        //console.log(onu_count);
        return onu_count;
    });
}
function get_RX_ONU_data(data) {
    return new Promise(function(resolve, reject) {
        let sql_0 = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') AS dates FROM aarx_status WHERE NE_Name LIKE '"
            + data.prefix + 
            "%' GROUP BY DATE_FORMAT(create_at, '%y-%m-%d') ORDER BY YEAR(create_at) DESC, MONTH(create_at) DESC, DAYOFMONTH(create_at) DESC";
        db_conn.query(sql_0, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows[0]);
            let curr_date = rows[0].dates;
            // get all master id that use by those prefix
            let sql_1 = "SELECT * FROM aarx_status WHERE NE_Name LIKE '"+ data.prefix + "%' AND status = 1";
            // get all master id that use by those prefix
            let sql_2 = "SELECT * FROM import_data WHERE start_at LIKE '"+ curr_date + "%' AND NE_Name LIKE '"+ data.prefix + "%'";
            //console.log(sql_2);
            
            let pons=  new Promise(function(resolve, reject) {
                db_conn.query(sql_1, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows);
                });
            });
            let onus =  new Promise(function(resolve, reject) {
                db_conn.query(sql_2, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows);
                });
            });
            return Promise.all([pons, onus]).then((res) => {
                //console.log(res);
                let pon_data = res[0];
                let onu_data = res[1];
                
                let NRSSP = '';
                let good = bad = offline = match = not_match = 0;
                let onu_count = [];
               
                //console.log('Get qty for onu = ' + onu_data.length);
                //console.log('Get qty for pon = ' + pon_data.length);
                pon_data.forEach(pon => {
                    good = 0; 
                    bad = 0;
                    offline = 0;
                    not_match = 0;
                    onu_data.forEach((onu) => {
                        if(onu.Received_Optical_Power != '--') {
                            NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                            if(NRSSP == pon.NRSSP) {
                                //console.log("NRSSP = " + NRSSP + " Get AARX = " + AARX_Power.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                                if((onu.Received_Optical_Power - pon.aarx) < (-2)) {
                                    //console.log('This is bad');
                                    bad++;
                                } else {
                                    //console.log('This is Good');
                                    good++;
                                }
                                match++;
                            } else {
                                //console.log(pon.NRSSP + ' vs ' + NRSSP);
                                not_match++;
                            }
                        } else {
                            offline++;
                            //console.log('offline');
                        }
                    })
                    onu_count.push( { 
                        pon_name : pon.NRSSP,
                        pon_aarx : pon.aarx,
                        good: good,
                        bad: bad,
                        offline: offline,
                        match: match,
                        not_match: not_match
                    });
                })
            //console.log(onu_count);
            resolve(onu_count);
        });
    })
    })
}
function getPONONURXData(data) {
    // get all master id that use by those prefix
    let sql = "SELECT * FROM import_data WHERE NE_Name LIKE '"+ data.ne_name + 
    "' AND Rack = "+ data.rack +
    " AND Shelf = "+ data.shelf +
    " AND Slot = "+ data.slot +
    " AND Port = "+ data.port +
    " AND (master_id = -1";

    data.master_id.forEach(item => {
        sql += ' OR master_id = ' + item;
    })

    sql += ')';
    //console.log(sql);
    let onus = new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    return Promise.all([onus]).then((res) => {
        //console.log(res);
        return res;
    });
}
function get_PON_ONU_RX_data(data) {
    // get all master id that use by those prefix
    let sql = "SELECT * FROM import_data WHERE NE_Name LIKE '"+ data.ne_name + 
    "' AND Rack = "+ data.rack +
    " AND Shelf = "+ data.shelf +
    " AND Slot = "+ data.slot +
    " AND Port = "+ data.port +
    " AND (master_id = -1";

    data.master_id.forEach(item => {
        sql += ' OR master_id = ' + item;
    })

    sql += ')';
    //console.log(sql);
    let onus = new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    return Promise.all([onus]).then((res) => {
        //console.log(res);
        return res;
    });
}
function _getNCONUData(data) {
//console.log(data);
    // get all master prefix that has status active == 0 or previous == 1
    let sql = "SELECT * FROM aarx_master WHERE id = " + data.master_id;
    let sql_1 = "SELECT * FROM aarx_status WHERE status = 1 AND master_id = "+ data.master_id + " AND NE_Name LIKE '"+ data.prefix + "%'";
    // get all master id that use by those prefix
    let sql_2 = "SELECT * FROM import_data WHERE master_id = "+ data.master_id + " AND NE_Name LIKE '"+ data.prefix + "%'";
    
    let master_data =  new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    let pons=  new Promise(function(resolve, reject) {
        db_conn.query(sql_1, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    let onus =  new Promise(function(resolve, reject) {
        db_conn.query(sql_2, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });
    return Promise.all([master_data, pons, onus]).then((res) => {
        //console.log(res);
        let onu_data = res[2];
        let pon_data = res[1];
        let NRSSP = '';
        let onu_res_data = [];

        pon_data.forEach(pon => {
            //console.log(pon.NRSSP);
            onu_data.forEach((onu) => {
                NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                if(NRSSP == pon.NRSSP) {
                    //console.log("NRSSP = " + NRSSP + " Get AARX = " + AARX_Power.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                    if((onu.Received_Optical_Power - pon.aarx) > (2)) {
                        //console.log('This is over range onu');
                        let _onu_data = {
                            onu_id: onu.ONU_ID,
                            NRSSP: pon.NRSSP,
                            name: onu.Name,
                            rx: onu.Received_Optical_Power,
                            aarx : pon.aarx
                        };
                        onu_res_data.push(_onu_data);
                    }
                }
            })
        })
        //console.log(onu_count);
        return onu_res_data;
    });
}
function get_NC_ONU_data(data) {
    return new Promise(function(resolve, reject) {
        let sql_0 = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') AS dates FROM aarx_status WHERE NE_Name LIKE '"
            + data.prefix + 
            "%' GROUP BY DATE_FORMAT(create_at, '%y-%m-%d') ORDER BY YEAR(create_at) DESC, MONTH(create_at) DESC, DAYOFMONTH(create_at) DESC";
        db_conn.query(sql_0, function (err, rows, fields) {
            if (err) throw err;
            //console.log(rows[0]);
            let curr_date = rows[0].dates;
            // get all master id that use by those prefix
            let sql_1 = "SELECT * FROM aarx_status WHERE NE_Name LIKE '"+ data.prefix + "%' AND status = 1";
            // get all master id that use by those prefix
            let sql_2 = "SELECT * FROM import_data WHERE start_at LIKE '"+ curr_date + "%' AND NE_Name LIKE '"+ data.prefix + "%'";
            //console.log(sql);
            
            let pons=  new Promise(function(resolve, reject) {
                db_conn.query(sql_1, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows);
                });
            });
            let onus =  new Promise(function(resolve, reject) {
                db_conn.query(sql_2, function (err, rows, fields) {
                    if (err) throw err;
                    resolve(rows);
                });
            });
            return Promise.all([pons, onus]).then((res) => {
                //console.log(res);
                let pon_data = res[0];
                let onu_data = res[1];
                let NRSSP = '';
                let onu_res_data = [];
                let AARX_Power = null;
                //console.log('Get qty for onu = ' + onu_data.length);
                //console.log('Get qty for pon = ' + pon_data.length);
                onu_data.forEach((onu) => {
                    NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                    AARX_Power = pon_data.find((pon_item) => {
                        return pon_item.NRSSP == NRSSP;
                    })
                    if(NRSSP == AARX_Power.NRSSP) {
                        //console.log("NRSSP = " + NRSSP + " Get AARX = " + AARX_Power.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                        if((onu.Received_Optical_Power - AARX_Power.aarx) < (-2)) {
                            //console.log('This is over range onu');
                            onu_res_data.push({
                                onu_id: onu.ONU_ID,
                                NRSSP: AARX_Power.NRSSP,
                                name: onu.Name,
                                rx: onu.Received_Optical_Power,
                                aarx : AARX_Power.aarx
                            });
                        }
                    }
                })
                resolve(onu_res_data);;
            });
        });
    });
}
function getCountNCONUData(data) {

    let sql = "SELECT DATE_FORMAT(create_at, '%Y-%m-%d') AS dates FROM aarx_status WHERE NE_Name LIKE '"+ data.prefix + "%' GROUP BY DATE_FORMAT(create_at, '%y-%m-%d') ORDER BY YEAR(create_at) DESC, MONTH(create_at) DESC, DAYOFMONTH(create_at) DESC";
    let data_date = new Promise(function(resolve, reject) {
        db_conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            resolve(rows);
        });
    });

    return Promise.all([data_date]).then((dates) => {
        //console.log(dates[0][0]);
        let curr_date = dates[0][0].dates;
        let prev_date = dates[0][1].dates;

        let sql_current = "SELECT * FROM aarx_status WHERE create_at like '"+
        curr_date + "%' AND NE_Name LIKE '"+ data.prefix + "%'";
        let sql_previous = "SELECT * FROM aarx_status WHERE create_at like '"+
        prev_date + "%' AND NE_Name LIKE '"+ data.prefix + "%'";
    // get all master id that use by those prefix
        let sql_2 = "SELECT * FROM import_data WHERE NE_Name LIKE '"+ data.prefix + 
        "%' AND start_at LIKE '"+ curr_date + "%'";
        
        //console.log(sql_current);
        let pons = new Promise(function(resolve, reject) {
            db_conn.query(sql_current, function (err, rows, fields) {
                if (err) throw err;
                resolve(rows);
            });
        });
        let prev_pons = new Promise(function(resolve, reject) {
            db_conn.query(sql_previous, function (err, rows, fields) {
                if (err) throw err;
                resolve(rows);
            });
        });
        let onus = new Promise(function(resolve, reject) {
            db_conn.query(sql_2, function (err, rows, fields) {
                if (err) throw err;
                resolve(rows);
            });
        });
        return Promise.all([pons, prev_pons, onus]).then((res) => {
            //console.log(res);
            let curr_pon_data = res[0];
            let prev_pon_data = res[1];
            let onu_data = res[2];
            let NRSSP = '';
            let onu_res_data = {};
            let prev_count = 0;
            let curr_count = 0;

            curr_pon_data.forEach(pon => {
                //console.log(pon.NRSSP);
                onu_data.forEach((onu) => {
                    NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                    //console.log("NRSSP = " + NRSSP);
                    if(NRSSP == pon.NRSSP) {
                        //console.log("NRSSP = " + NRSSP + " Get AARX = " + pon.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                        if((onu.Received_Optical_Power - pon.aarx) > (2)) {
                            //console.log('This is over range onu');
                            curr_count++
                        }
                    }
                })
            })
            prev_pon_data.forEach(pon => {
                //console.log(pon.NRSSP);
                onu_data.forEach((onu) => {
                    NRSSP = onu.NE_Name + '-' + onu.Rack + '-' + onu.Shelf + '-' + onu.Slot + '-' + onu.Port;
                    //console.log("NRSSP = " + NRSSP);
                    if(NRSSP == pon.NRSSP) {
                        //console.log("NRSSP = " + NRSSP + " Get AARX = " + pon.aarx + " VS ONU_RX = " + onu.Received_Optical_Power);
                        if((onu.Received_Optical_Power - pon.aarx) > (2)) {
                            //console.log('This is over range onu');
                            prev_count++;
                        }
                    }
                })
            })
            
            onu_res_data.pon_quantity = curr_pon_data.length;

            onu_res_data.curr_date = curr_date;
            onu_res_data.prev_date = prev_date;
            onu_res_data.current = curr_count;
            onu_res_data.previous = prev_count;
            onu_res_data.curr_onu_count = onu_data.length;

            console.log(onu_res_data);
            return onu_res_data;
        });
    })
    
}
module.exports = {
    getOverAllNEData,
    getDataByPrefix,
    get_PON_data_by_prefix,
    getOverAllMasterData,
    getMasterIDByPrefix,
    getActiveMasterIDByPrefix,
    countPONByMasterID,
    getRXONUCount,
    _getRXONUData,
    get_RX_ONU_data,
    get_PON_ONU_RX_data,
    getPONONURXData,
    _getNCONUData,
    get_NC_ONU_data,
    getCountNCONUData,

    getTXONUCount,
    get_TX_NC_ONU_data
}