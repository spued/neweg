const db = require('../model');
const logger = require('../lib/logger');
const { PasswordNoMatch, PasswordHashFailed, DbNoResult } = require('../errors');
const axios = require('axios').default;
const dotenv = require('dotenv').config();
const translator = require('../lib/attribute_translator');



const getDeviceManPage = (req, res) => {
    console.log("Controller: Main: Get Device Manager page");
    res.render('pages/deviceman', req.user);
}
const post_search_device = (req, res) => {
    console.log("Controller: Main: Post Device search");
    resData = {
        code : 1,
        msg : 'Error : Default',
        data : []
    };
    //console.log(req.user);
    const user_right = req.user.right.split(',');
    //console.log(user_right);
    if(user_right.length > 0 || req.user.type == 'admin') {
        const cn_number = user_right.find(prefix =>  req.body.cn.startsWith(prefix));
        if(cn_number != undefined || req.user.type == 'admin') {
            const device_url = process.env.ACS_API_DEVICES;
            const search_query = '{ "VirtualParameters.circuit_number._value" : "/'+ req.body.cn +'/" }'
            axios.get(device_url, { params: { query:  search_query }}).then((response) => {
                // handle success
                //console.log(response.data);
                let data_t = [];

                for(const element of response.data) {
                    //console.log(element);
                    data_t.push(translator.map_attribute(element));
                }
                
                resData.data = response.data;
                resData.data_t = data_t;
                resData.code = 0;
                resData.msg = 'ok';
                res.json(resData);
            }).catch((error) => {
                // handle errors
                    console.log('Error : ' + error)
                    res.json(resData);
            });
        } else {
            resData.code = 2;
            resData.msg = 'user right not permit';
            res.json(resData);
        }
    } else {
        resData.code = 3;
        resData.msg = 'user right error';
        res.json(resData);
    }
    
}
const post_user_note_save = (req, res) => {
    console.log("Controller: Main: Post user note save");
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };

    console.log(req.body);
    db.save_user({
        user_id : req.user._id,
        note : req.body.note
    });
    res.json(resData);
}
const post_user_note_load = async (req, res) => {
    console.log("Controller: Main: Post user note load");
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };

    const _data = await db.getUserFromID(req.user._id);
    //console.log(_data);
    resData.code = 0;
    resData.msg = 'ok';
    resData.data = _data.note;
    res.json(resData);
}
const post_device_history_save = (req, res) => {
    console.log("Controller: Main: Post Device history save");
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };

    //console.log(req.body);
    db.save_user({
        user_id : req.user._id,
        history_data : req.body.history_data
    });
    res.json(resData);
}
const post_device_history_load = async (req, res) => {
    console.log("Controller: Main: Post Device history load");
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };

    const _data = await db.getUserFromID(req.user._id);
    //console.log(_data);
    resData.code = 0;
    resData.msg = 'ok';
    resData.data = _data.history_data;
    res.json(resData);
}

const post_refresh_params = (req, res) => {
    console.log("Controller: Main: Post Device refresh");
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };

    const device_url = process.env.ACS_API_DEVICES;
    axios.post(device_url + "/" + req.body.cn + '/tasks?connection_request',  
        { 
            "name": "refreshObject", 
            "objectName": req.body.obj
        }).then((response) => {
        // handle success
        console.log(response.data);
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors
        console.log('Error : ' + error)
        res.json(resData);
    });
}
const post_query_params = (req, res) => {
    console.log("Controller: Main: Post Device query " + req.body.id);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    
    const search_query = '{"_id" : "'+ req.body.id +'"}'; 
    const filter = req.body.obj;

    //console.log(search_query + filter);
    axios.get(process.env.ACS_API_DEVICES, { 
        params: { 
            query:  search_query, 
            projection: filter 
            }
        }).then((response) => { 
        // handle success
        //console.log(response.data);
        resData.data = response.data[0];
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors
        console.log('Error : ' + error)
        res.json(resData);
    });
}
const post_device_reboot = (req, res) => {
    console.log("Controller: Main: Set Device reboot");
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "reboot"
        }).then((response) => {
        // handle success
        //console.log(response.data);
        
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors
        console.log('Error : ' + error)
        res.json(resData);
    });
}
const post_system_save = (req,res) => {
    console.log("Controller: Main: Set Device system for " + req.body.deviceId);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    var remote_config = translator.map_acs(req.body);
    //console.log(remote_config);]

    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config.parameterValues
        }).then((response) => {
        // handle success
        //console.log(response.data);
        
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors
        console.log('Error : ' + error)
        res.json(resData);
    }); 
}
const post_lan_save = (req,res) => {
    console.log("Controller: Main: Set Device LAN config for " + req.body.deviceId);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    var remote_config = translator.map_acs(req.body);
    //console.log(remote_config);
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config.parameterValues
        }).then((response) => {
        // handle success
        //console.log(response.data);
        
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors 
        console.log('Error : ' + error);
        res.json(resData);
    });
}
const post_wlan_save = (req,res) => {
    console.log("Controller: Main: Set Device WLAN config for " + req.body.deviceId);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    var remote_config = translator.map_acs(req.body);
    
    //console.log(remote_config);
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config.parameterValues
        }).then((response) => {
        // handle success
        //console.log(response.data);
        
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors 
        console.log('Error : ' + error);
        res.json(resData);
    });
}
const post_wlan_neighbor = (req,res) => {
    console.log("Controller: Main: Set Device WLAN neighbor list for " + req.body.deviceId);
    //console.log(req.body);

    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    var remote_config = [];
    remote_config.push(["InternetGatewayDevice.LANDevice.1.WIFI.Radio."+ req.body.id +".DiagnosticsState", 'Requested']);
    //console.log(remote_config);
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config
        }).then((response) => {
        // handle success
        //console.log(response.data);
        
        return response.data;
    }).then((data) => {
        //console.log(data);
        axios.get(process.env.ACS_API_DEVICES, { 
            params: { 
                query:  '{"_id" : "'+  data.device +'"}', 
                projection: 'InternetGatewayDevice.LANDevice.1.WIFI.Radio.' + req.body.id
                }
            }).then((_response) => { 
            // handle success
            //console.log(_response.data[0].InternetGatewayDevice.LANDevice[1].WIFI.Radio);
            resData.data = _response.data[0].InternetGatewayDevice.LANDevice[1].WIFI.Radio;
            resData.code = 0;
            resData.msg = 'ok';
            res.json(resData);
        })
    }).catch((error) => {
    // handle errors 
        console.log('Error : ' + error);
        res.json(resData);
    }); 
}
const post_voip_save = (req,res) => {
    console.log("Controller: Main: Set Device VoIP config for " + req.body.deviceId);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    var remote_config = translator.map_acs(req.body);
    console.log(remote_config);
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config.parameterValues
        }).then((response) => {
        // handle success
        console.log(response.data);
        
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors 
        console.log('Error : ' + error);
        res.json(resData);
    });
}
const post_ddns_save = (req,res) => {
    console.log("Controller: Main: Set Device DDNS config for " + req.body.deviceId);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    var remote_config = translator.map_acs(req.body);
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config.parameterValues
        }).then((response) => {
        // handle success
        //console.log(response.data);
        
        resData.data = response.data;
        resData.code = 0;
        resData.msg = 'ok';
        res.json(resData);
    })
    .catch((error) => {
    // handle errors 
        console.log('Error : ' + error);
        res.json(resData);
    });
}
const post_port_forward_add = (req,res) => {
    console.log("Controller: Main: Add Device Port forward config for " + req.body.deviceId);
    //console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    if(req.body.pf_action == 'add') {
        axios.post(device_url, {
            "name": "addObject", 
            "objectName": "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.2.PortMapping"
        }).then((response) => {
            // handle success
            console.log(response.data);
            resData.data = response.data;
            resData.code = 0;
            resData.msg = 'ok';
            res.json(resData);
        })
        .catch((error) => {
        // handle errors 
            console.log('Error : ' + error);
            res.json(resData);
        });
    } else {
        res.json(resData);
    }
}
const post_port_forward_delete = (req,res) => {
    console.log("Controller: Main: Delete Device Port forward config for " + req.body.deviceId);
    console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
  const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    if(req.body.pf_action == 'delete') {
        axios.post(device_url, {
            "name": "deleteObject", 
            "objectName": "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.2.PortMapping." + req.body.pf_number
        }).then((response) => {
            // handle success
            console.log(response.data);
            resData.data = response.data;
            resData.code = 0;
            resData.msg = 'ok';
            res.json(resData);
        })
        .catch((error) => {
        // handle errors 
            console.log('Error : ' + error);
            res.json(resData);
        });
    } else {
        res.json(resData);
    }
}
const post_port_forward_save = (req,res) => {
    console.log("Controller: Main: Set Device Port forward config for for " + req.body.deviceId +" index = " + req.body.pf_index);
    console.log(req.body);
    resData = {
        code : 1,
        msg : 'Error : Default' 
    };
    const device_url = process.env.ACS_API_DEVICES + '/'+ req.body.deviceId +'/tasks?timeout=3000&connection_request';
    var remote_config = [];
    const _index = 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.2.PortMapping.'+ req.body.pf_index + '.';
    
    remote_config.push([_index + 'ExternalPort', req.body.pf_external_port]);
    remote_config.push([_index + 'InternalClient', req.body.pf_internal_ip]);
    remote_config.push([_index + 'InternalPort', req.body.pf_internal_port]);
    if(req.body.pf_enable == 'true') {
        remote_config.push([_index + 'PortMappingEnabled', true]);
    } else if(req.body.pf_enable == 'false') {
        remote_config.push([_index + 'PortMappingEnabled', false]);
    }
    
    //console.log(remote_config);
    if(req.body.pf_action == 'edit') {
        axios.post(device_url, {
            "name": "setParameterValues", 
            "parameterValues": remote_config
        }).then((response) => {
            // handle success
            //console.log(response.data);
            resData.data = response.data;
            resData.code = 0;
            resData.msg = 'ok';
            res.json(resData);
        })
        .catch((error) => {
        // handle errors 
            console.log('Error : ' + error);
            res.json(resData);
        });
    }
}
module.exports = {
    getDeviceManPage,
    post_search_device,
    post_refresh_params,
    post_query_params,

    post_user_note_save,
    post_user_note_load,
    post_system_save,
    post_lan_save,
    post_wlan_save,
    post_wlan_neighbor,
    post_voip_save,
    post_ddns_save,
    post_port_forward_save,
    post_port_forward_add,
    post_port_forward_delete,
    post_device_history_save,
    post_device_history_load,
    post_device_reboot
}