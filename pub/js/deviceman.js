var canvas = document.getElementById("cpe_canvas");
var ctx = canvas.getContext("2d");
var tableWlanNeighbor24 = null;
var tableWlanNeighbor5 = null;
var tableLanHostList = null;


var lan_image = null;
var lan_up_image = null;
var lan_disable_image = null;
var wifi_image = null;
var wifi_up_image = null;
var phone_image = null;
var phone_up_image = null;
var phone_down_image = null;
var wan_image = null;
var wan_up_image = null;
// Default system tab
var current_config_tab = undefined;
var history_cpe = JSON.parse(sessionStorage.getItem("history_cpe"));

if(history_cpe == null) history_cpe = [];
// Retrieve data
var current_cpe = sessionStorage.getItem("current_cpe");
//console.log("Working on " + current_cpe); // This is some sample text data

var device_summary_array = undefined;

$(document).ajaxStart(function(){
    $('#loadingModal').modal('show');
  });
$(document).ajaxStop(function(){
    $('#loadingModal').modal('hide');
});

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [
      h,
      m > 9 ? m : (h ? '0' + m : m || '0'),
      s > 9 ? s : '0' + s
    ].filter(Boolean).join(':');
}



$(function() {
    //console.log('Device manager page are loaded');
    $('#device_canvas').attr('hidden','true');
    $('#device_note').attr('hidden','true');
    $('#device_config_tab_tab').attr('hidden','true');
    $('#table_device_info').attr('hidden','true');

    //console.log(history_cpe);
    $.post('/device_history_load',{}, (history) => {
        //console.log(history.data);
        history_cpe = JSON.parse(history.data);
        //console.log(history_cpe);
        if(history_cpe.length > 0) {
            let buttons = $('.btn-history-cpe');
            for (let i = 0; i < history_cpe.length; i++) {
            $(buttons[i]).text(history_cpe[i]);
            }
        }
    });
    $.post('/user_note_load',{}, (note) => {
        $('#user_note').val(note.data);
    });
    if(current_cpe != null) {
        $('#search_keyword').val(current_cpe);
    }
});

window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    //e.returnValue = 'Good bye';
    if(history_cpe.length > 0) {
        $.post('/device_history_save',{ 
            history_data : JSON.stringify(history_cpe)
        });
    }
    return undefined;
});

$('.btn-history-cpe').on('click', function(){
    //console.log($(this).text());
    if($(this).text() != '-') $('#search_keyword').val($(this).text()).trigger('focus');

    $.post('/device_note_load',{ 
        circuit_number : $(this).text()
    }, (_res) => {
        if(_res) {
            $('#device_note_pre_search').text(_res.data);
        } else {
            $('#device_note_pre_search').text('');
        }
        
    });
});

$('#search_button').on('click', function (evt) {
    //console.log('sEarch cli k!');
    const regex = RegExp('^[0-9]{4}j[0-9]{4}');
    const regex2 = RegExp('^SYC.{10}');
    const _test = (regex.test($('#search_keyword').val()) || regex2.test($('#search_keyword').val()));
    if(!(_test)) {
        alert('Incorrect format (XXXXjXXXX)');
        return 0;
    }
    const _post_data = {
        cn : $('#search_keyword').val()
        //cn : '2271j6903'
    }
    $.post('/search_device',_post_data, (res) => {
        if(res.data.length <= 0) {
            alert("Device not found.");
        } else if(res.data.length == 1) {
            $('#table_device_info').removeAttr('hidden');
            $('#device_canvas').removeAttr('hidden');
            $('#device_note').removeAttr('hidden');
            $('#device_config_tab_tab').removeAttr('hidden');
            
            //console.log(res.data_t)
           
            let cpe = res.data_t[0];
            let last_inform = moment(cpe.last_inform);
            //console.log(last_inform);
            if(!last_inform.isAfter(moment().subtract(1, 'hours'))) {
                //console.log("device is offline");
                $('#device_status').val('Offline');
            } else {
                //console.log("device is online");
                $('#device_status').val('Online');
            }
            $('#current_device_id').val(res.data[0]._id);
            $('#last_update').text(last_inform.format('DD/MMM/YYYY - HH:mm'));
            $('#circuit_number').text(cpe.circuit_number);
            $('#sn').text(cpe.serial_number);
            $('#wan_ip').text( cpe.wan_ip + ' (' + cpe.wan_mac + ')');
            $('#model').text(cpe.manufacturer + ' : ' + cpe.product_class );
            $('#product_class').val(cpe.product_class);
            $('#software_version').text(cpe.software_version);
            $('#search_keyword').val(cpe.circuit_number);
            $('#current_circuit_number').val(cpe.circuit_number);
            //console.log(cpe.device_summary);
            device_summary_array = cpe.device_summary.split(',');
            
            device_summary = {};
            device_summary_array.forEach(element => {
                let arr = element.split(':');
                device_summary[arr[0].trim()] = parseInt(arr[1]);
            });
            //console.log(device_summary);
            // Store data
            sessionStorage.setItem("current_cpe", cpe.circuit_number);
           
            if (!history_cpe.includes(cpe.circuit_number)) {
                if(history_cpe.length > 9) {
                    history_cpe.shift();
                }
                history_cpe.push(cpe.circuit_number);
                if(history_cpe.length > 0) {
                    let buttons = $('.btn-history-cpe');
                    for (let i = 0; i < history_cpe.length; i++) {
                    $(buttons[i]).text(history_cpe[i]);
                    }
                }
                sessionStorage.setItem("history_cpe", JSON.stringify(history_cpe));
            }
            
            drawCPE(ctx, device_summary, 
                cpe.wlan_status, 
                cpe.ethernet_status,
                cpe.lan_ip_status,
                cpe.pon_status,
                cpe.voip_status,
                cpe.wan_ip
            );

            
            if(tableWlanNeighbor24 != null)  {
                tableWlanNeighbor24.clear().destroy();
                tableWlanNeighbor24 = null;
            }

            if(tableWlanNeighbor5 != null) {
                tableWlanNeighbor5.clear().destroy();
                tableWlanNeighbor5 = null;
            }
            //console.log(current_config_tab);
            if(current_config_tab != 'system' && current_config_tab != undefined) {
                $('#device_system_link').trigger("click");
            } else {
                $('#device_system_link').trigger('shown.bs.tab');
            }
            
        } else {
            // if found many devices
            alert('Found many devices.');
            return 0;
        }
    }).then(()=>{
        
        $.post('/device_note_load',{ 
            circuit_number : $('#current_circuit_number').val() 
        }, (_res) => {
            //console.log(_res.data);
            $('#device_note_area').val(_res.data);
        });
    })

   
})
$(".nav-tabs a").on('click',function() {
    //console.log('a click');
    $(this).tab('show');
});

const checkValidIpv4 = (ipaddress) => {
    //console.log(ipaddress);
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
        return (true)  
      }  
      //console.log("You have entered an invalid IP address!")  
      return (false)  
}

function validateSystemSetting() {
    if ($("#provisioning_code").val() == '') {
      $("#provisioning_code_check").show();
      $("#provisioning_code_check").html("**field empty");
      $("#provisioning_code_check").css("color", "red");
      return false;
    } else {
      $("#provisioning_code_check").hide();
      return true;
    }
}
function validateLANSetting() {
    let result = true;
    if(!checkValidIpv4($("#lan_ip_address").val())) {
        $("#lan_ip_address_check").show();
        $("#lan_ip_address_check").html("**IP address");
        $("#lan_ip_address_check").css("color", "red");
        result = false;
    } else {
        $("#lan_ip_address_check").hide();
        
    }
    if(!checkValidIpv4($("#lan_dhcp_pool_start").val())) {
        $("#lan_dhcp_pool_start_check").show();
        $("#lan_dhcp_pool_start_check").html("**IP address");
        $("#lan_dhcp_pool_start_check").css("color", "red");
        result = false;
    } else {
        $("#lan_dhcp_pool_start_check").hide();
        
    }
    if(!checkValidIpv4($("#lan_dhcp_pool_end").val())) {
        $("#lan_dhcp_pool_end_check").show();
        $("#lan_dhcp_pool_end_check").html("**IP address");
        $("#lan_dhcp_pool_end_check").css("color", "red");
        result = false;
    } else {
        $("#lan_dhcp_pool_end_check").hide();
        
    }
    if(!checkValidIpv4($("#lan_dns_server").val())) {
        $("#lan_dns_server_check").show();
        $("#lan_dns_server_check").html("**IP address");
        $("#lan_dns_server_check").css("color", "red");
        result = false;
    } else {
        $("#lan_dns_server_check").hide();
    }
    let pattern = /^-?\d*\.?\d*$/;
    if(!(pattern.test($("#lan_dhcp_lease_time").val()) && $("#lan_dhcp_lease_time").val() != '')) {
        $("#lan_dhcp_lease_time_check").show();
        $("#lan_dhcp_lease_time_check").html("**Number");
        $("#lan_dhcp_lease_time_check").css("color", "red");
        result = false;
    } else {
        $("#lan_dhcp_lease_time_check").hide();
    }
    return result;
}

function validateWLANSetting() {
    let result = true;

    if(!$('#wlan_ssid_24').val() != '') {
        $("#wlan_ssid_24_check").show();
        $("#wlan_ssid_24_check").html("**Required");
        $("#wlan_ssid_24_check").css("color", "red");
        result = false;
    } else {
        $("#wlan_ssid_24_check").hide();
    }
    if(!$('#wlan_key_24').val() != '') {
        $("#wlan_key_24_check").show();
        $("#wlan_key_24_check").html("**Required");
        $("#wlan_key_24_check").css("color", "red");
        result = false;
    } else {
        $("#wlan_key_24_check").hide();
    }
    if(!$('#wlan_ssid_5').val() != '') {
        $("#wlan_ssid_5_check").show();
        $("#wlan_ssid_5_check").html("**Required");
        $("#wlan_ssid_5_check").css("color", "red");
        result = false;
    } else {
        $("#wlan_ssid_5_check").hide();
    }
    if(!$('#wlan_key_5').val() != '') {
        $("#wlan_key_5_check").show();
        $("#wlan_key_5_check").html("**Required");
        $("#wlan_key_5_check").css("color", "red");
        result = false;
    } else {
        $("#wlan_key_5_check").hide();
    }
    return result;
}

function validateVoIPSetting() {
    let result = true;

    if(!$('#line_1_number').val() != '') {
        $("#line_1_number_check").show();
        $("#line_1_number_check").html("**Required");
        $("#line_1_number_check").css("color", "red");
        result = false;
    } else {
        $("#wlan_ssid_24_check").hide();
    }
    if(!$('#line_1_password').val() != '') {
        $("#line_1_password_check").show();
        $("#line_1_password_check").html("**Required");
        $("#line_1_password_check").css("color", "red");
        result = false;
    } else {
        $("#line_1_password_check").hide();
    }
    if(!$('#line_2_number').val() != '') {
        $("#line_2_number_check").show();
        $("#line_2_number_check").html("**Required");
        $("#line_2_number_check").css("color", "red");
        result = false;
    } else {
        $("#wlan_ssid_24_check").hide();
    }
    if(!$('#line_2_password').val() != '') {
        $("#line_2_password_check").show();
        $("#line_2_password_check").html("**Required");
        $("#line_2_password_check").css("color", "red");
        result = false;
    } else {
        $("#line_2_password_check").hide();
    }
    if(!checkValidIpv4($("#proxy_server_ip").val())) {
        $("#proxy_server_ip_check").show();
        $("#proxy_server_ip_check").html("**IP address");
        $("#proxy_server_ip_check").css("color", "red");
        result = false;
    } else {
        $("#proxy_server_ip_check").hide();
        
    }
    return result;
}
function validateDDNSSetting() {
    let result = true;
    if(!$('#ddns_hostname').val() != '') {
        $("#ddns_hostname_check").show();
        $("#ddns_hostname_check").html("**Required");
        $("#ddns_hostname_check").css("color", "red");
        result = false;
    } else {
        $("#ddns_hostname_check").hide();
    }
    if(!$('#ddns_username').val() != '') {
        $("#ddns_username_check").show();
        $("#ddns_username_check").html("**Required");
        $("#ddns_username_check").css("color", "red");
        result = false;
    } else {
        $("#ddns_username_check").hide();
    }
    if(!$('#ddns_password').val() != '') {
        $("#ddns_password_check").show();
        $("#ddns_password_check").html("**Required");
        $("#ddns_password_check").css("color", "red");
        result = false;
    } else {
        $("#ddns_password_check").hide();
    }
    if(!$('#ddns_server').val() != '') {
        $("#ddns_server_check").show();
        $("#ddns_server_check").html("**Required");
        $("#ddns_server_check").css("color", "red");
        result = false;
    } else {
        $("#ddns_server_check").hide();
    }
    return result;
}

function validatePortForwardSetting() {
    let result = true;
    if(!($('#e_external_port').val() != '' && $('#e_external_port').val() != '0' &&
            $('#e_external_port').val() != '' && $('#e_external_port').val() != '0' &&
            $('#e_external_port').val() != '' && $('#e_internal_ip').val() != '0.0.0.0'
        )) {
        $("#port_forward_check").show();
        $("#port_forward_check").html("** Data Required or not equal to 0");
        $("#port_forward_check").css("color", "red");
        result = false;
    } else {
        $("#port_forward_check").hide();
    }
    return result;
}
$('#btn_save_device_note').on('click',function(evt){
    let _post_data = {
        circuit_number : $('#current_circuit_number').val(),
        note : $('#device_note_area').val()
    };
    $.post('/device_note_save', _post_data, (res) => {
        //console.log(res);
    })
})
$('#btn_save_note').on('click',function(evt){
    let _post_data = {
        note : $('#user_note').val()
    };
    $.post('/user_note_save', _post_data, (res) => {
        //console.log(res);
    })
})
$('.btn-save').on('click',function(evt){
    let _post_data = {};
    switch(current_config_tab) {
        case 'system':
            //console.log('system save clicked');
            if(validateSystemSetting()) {
                _post_data = {
                    product_class : $('#product_class').val(),
                    deviceId : $('#current_device_id').val(),
                    provisioning_code : $('#provisioning_code').val(),
                    remote_config_enable : $('#remote_config_enable').val()
                }
                // send ajax request for data
                $.post('/system_save', _post_data, (res) => {
                    //console.log(res);
                })
            }
            break;
        case 'lan':
            //console.log('lan save clicked');
            if(validateLANSetting()) {
                _post_data = {
                    product_class : $('#product_class').val(),
                    deviceId : $('#current_device_id').val(),
                    lan_ip : $('#lan_ip_address').val(),
                    lan_netmask : $('#lan_netmask').val(),
                    lan_dhcp_status : $('#lan_dhcp_status').val(),
                    lan_dhcp_pool_start : $('#lan_dhcp_pool_start').val(),
                    lan_dhcp_pool_end : $('#lan_dhcp_pool_end').val(),
                    lan_dhcp_lease_time : $('#lan_dhcp_lease_time').val(),
                    lan_dns_servers : $('#lan_dns_server').val()
                }
                // send ajax request for data
                $.post('/lan_save', _post_data, (res) => {
                    //console.log(res);
                })
            }
            break;
        case 'wlan':
            //console.log('lan save clicked');
            if(validateWLANSetting()) {
                _post_data = {
                    product_class : $('#product_class').val(),
                    deviceId : $('#current_device_id').val(),
                    wlan_ssid_24 : $('#wlan_ssid_24').val(),
                    wlan_key_24 : $('#wlan_key_24').val(),
                    wlan_channel_24 : $('#wlan_channel_24').val(),
                    wlan_ssid_5 : $('#wlan_ssid_5').val(),
                    wlan_key_5 : $('#wlan_key_5').val(),
                    wlan_channel_5 : $('#wlan_channel_5').val()    
                }
                // send ajax request for data
                $.post('/wlan_save', _post_data, (res) => {
                    //console.log(res);
                })
            }
            break;
        case 'voip':
            //console.log('lan save clicked');
            if(validateVoIPSetting()) {
                _post_data = {
                    product_class : $('#product_class').val(),
                    deviceId : $('#current_device_id').val(),
                    voip_number_1 : $('#line_1_number').val(),
                    voip_password_1 : $('#line_1_password').val(),
                    voip_number_2 : $('#line_2_number').val(),
                    voip_password_2 : $('#line_2_password').val(),
                    voip_proxy_server : $('#proxy_server_ip').val()    
                }
                // send ajax request for data
                $.post('/voip_save', _post_data, (res) => {
                    //console.log(res);
                })
            }
            break;
        case 'ddns':
            //console.log('lan save clicked');
            if(validateDDNSSetting()) {
                _post_data = {
                    product_class : $('#product_class').val(),
                    deviceId : $('#current_device_id').val(),
                    ddns_enable : $('#ddns_enable').val(),
                    ddns_provider : $('#ddns_provider').val(),
                    ddns_hostname : $('#ddns_hostname').val(),
                    ddns_username : $('#ddns_username').val(),
                    ddns_password : $('#ddns_password').val(),
                    ddns_server : $('#ddns_server').val()  
                }
                // send ajax request for data
                $.post('/ddns_save', _post_data, (res) => {
                    //console.log(res);
                })
            }
            break;
        default:
            //console.log('default save clicked')
            break;
    }
})

$(document).on('click','.btn-edit-port-forward', function (evt) {
    const modal = $('#modalPortForward');
    const data = $(this).closest("tr")[0].innerText.split('\t');
    //console.log(data);
    modal.find('#e_select_enable').val(data[4]);
    modal.find('#e_external_port').val(data[1]);
    modal.find('#e_internal_port').val(data[2]);
    modal.find('#e_internal_ip').val(data[3]);
    modal.find('#current_index').val(data[0]);
    modal.find('#action_type').val('edit');
    modal.modal('show');
});

$(document).on('click', '.btn-save-port-forward', function (evt) {
    const modal = $('#modalPortForward');
    if(validatePortForwardSetting()) {
        const _post_data = {
            deviceId : $('#current_device_id').val(),
            pf_enable : modal.find('#e_select_enable').val(),
            pf_external_port : modal.find('#e_external_port').val(),
            pf_internal_port : modal.find('#e_internal_port').val(),
            pf_internal_ip : modal.find('#e_internal_ip').val(),
            pf_action : modal.find('#action_type').val(),
            pf_index : modal.find('#current_index').val()
        }
        // send ajax request for data
        $.post('/port_forward_save', _post_data, (res) => {
            //console.log(res);
            if(res.code == 0) {
                alert('Port forward saved.');
                $('#device_port_forward_link').trigger('shown.bs.tab');
            } else {
                alert('Error occurred.');
            }
        })
    modal.modal('hide');
    }
});

$('#btn_add_port_forward').on('click', function (evt) {
    const _post_data = {
        deviceId : $('#current_device_id').val(),
        pf_action : 'add'
    }
    // send ajax request for data
    $.post('/port_forward_add', _post_data, (res) => {
        //console.log(res);
        if(res.code == 0) {
            alert('Port added.');
            $('#device_port_forward_link').trigger('shown.bs.tab');
        } else {
            alert('Error occurred.');
        }
    })
});
$(document).on('click','.btn-delete-port-forward', function (evt) {
    const data = $(this).closest("tr")[0].innerText.split('\t');
    //console.log(data)
    const _post_data = {
        deviceId : $('#current_device_id').val(),
        pf_number : data[0],
        pf_action : 'delete'
    }
    // send ajax request for data
    $.post('/port_forward_delete', _post_data, (res) => {
        //console.log(res);
        if(res.code == 0) {
            alert('Port deleted.');
            $('#device_port_forward_link').trigger('shown.bs.tab');
        } else {
            alert('Error occurred.');
        }
    })
});

$(document).on('click','.pf_close', function (evt) {
    const modal = $('#modalPortForward');
    modal.modal('hide');
})

$('.btn-refresh').on('click',function(evt){
    //console.log(current_config_tab);
    switch(current_config_tab) {
        case 'system':
            $('#device_system_link').trigger('shown.bs.tab');
            break;
        case 'wan':
            $('#device_wan_link').trigger('shown.bs.tab');
            break;
        case 'lan':
            $('#device_lan_link').trigger('shown.bs.tab');
            break;
        case 'wlan':
            $('#device_wlan_link').trigger('shown.bs.tab');
            break;
        case 'voip':
            $('#device_voip_link').trigger('shown.bs.tab');
            break;
        case 'ddns':
            $('#device_ddns_link').trigger('shown.bs.tab');
            break;
        case 'port_forward':
            $('#device_port_forward_link').trigger('shown.bs.tab');
        break;
        default:
            break;
    }
})

$('.btn-reboot').on('click',function(evt){
    //console.log('Device reboot clicked');
    if(confirm("Reoobt device?")) {
        let _post_data = {
            deviceId : $('#current_device_id').val()
        }
        // send ajax request for data
        $.post('/device_reboot', _post_data, (res) => {
            //console.log(res);
        })
    } else {
        return 0;
    }
    
})

$('#device_system_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'system';
    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.DeviceInfo'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
           // console.log(res);
            if(res.code == 0) {
                
            } else {
                //console.log(res);
            }
        }).then((data) => {
            const _post_data = {
                id : data.data.device,
                obj : data.data.objectName
            };
            //console.log(_post_data)
            $.post('/device_get_params', _post_data , (res) => {
                if(res.code == 0) {
                    if(res.data) {
                        let _data = res.data.InternetGatewayDevice.DeviceInfo;
                    
                        if('UpTime' in _data) {
                            //console.log('get uptime');
                            var duration = formatTime(_data.UpTime._value);
                            $('#uptime').val(duration + ' (' + _data.UpTime._value + ' seconds.)');
                        } else {
                            //console.log('no uptime');
                            $('#uptime').val('Not available');
                        }
                        
                        $('#provisioning_code').val(_data.ProvisioningCode._value);
                    }
                    
                } else {
                    
                    //console.log(res);
                }
            })
        })
    }
})
$('#device_wan_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'wan';
    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.WANDevice'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
            if(res.code == 0) {
                //return res.data;
            } else {
                //console.log(res);
            }
        }).then((data) => {
            $.post('/device_get_params', {
                id : data.data.device,
                obj : data.data.objectName
            }, (res) => {
                if(res.code == 0) {
                    let _data = res.data.InternetGatewayDevice.WANDevice["1"].WANConnectionDevice["1"].WANPPPConnection[2];
                    //console.log(_data);
                    if('Uptime' in _data && '_value' in _data.Uptime) {
                        //console.log('get uptime');
                        var duration = formatTime(_data.Uptime._value);
                        $('#wan_uptime').val(duration + ' (' + _data.Uptime._value + ' seconds.)');
                    } else {
                        //console.log('no uptime');
                        $('#wan_uptime').val('Not available');
                    }
                    //$('#wan_uptime').val(duration + ' (' + _data.Uptime._value + ' seconds.)');
                    if(_data.Name._value) $('#wan_name').val(_data.Name._value); 
                    else $('#wan_name').val('Not show'); 
                    if(_data.ConnectionStatus._value) $('#wan_status').val(_data.ConnectionStatus._value);
                    else $('#wan_status').val('Not show'); 
                    $('#wan_ip_address').val(_data.ExternalIPAddress._value);
                    
                } else {
                    //console.log(res);
                }
            })
        })
    }
})
$('#device_lan_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'lan';
    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.LANDevice'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
            if(res.code == 0) {
                //return res.data;
            } else {
                //console.log(res);
            }
        }).then((data) => {
            $.post('/device_get_params', {
                id : data.data.device,
                obj : data.data.objectName
            }, (res) => {
                if(res.code == 0) {
                    if(!res.data) {
                        return 0;
                    }
                    let _data = res.data.InternetGatewayDevice.LANDevice[1].LANHostConfigManagement;
                    let number_host = parseInt(res.data.InternetGatewayDevice.LANDevice[1].Hosts.HostNumberOfEntries._value);
                    let hosts = res.data.InternetGatewayDevice.LANDevice[1].Hosts;
                    if('_value' in _data.DHCPServerEnable) {
                        $('#lan_dhcp_lease_time').val( _data.DHCPLeaseTime._value);
                        $('#lan_dhcp_status').val(_data.DHCPServerEnable._value.toString()).trigger('change');
                        $('#lan_ip_address').val(_data.IPRouters._value);
                        $('#lan_netmask').val(_data.SubnetMask._value).trigger('change');
                        $('#lan_dhcp_pool_start').val(_data.MinAddress._value);
                        $('#lan_dhcp_pool_end').val(_data.MaxAddress._value);
                        $('#lan_dns_server').val(_data.DNSServers._value);
                    } else {
                        $('#lan_ip_address').val(_data.IPRouters._value);
                        $('#lan_netmask').val(_data.SubnetMask._value).trigger('change');
                        $('#lan_dhcp_status').val('false').trigger('change');
                        $('#lan_dhcp_lease_time').val('-');
                        $('#lan_dhcp_pool_start').val('-');
                        $('#lan_dhcp_pool_end').val('-');
                        $('#lan_dns_server').val('-');
                    }
                    var _hosts_list = [];
                    if(number_host > 0) {
                        //console.log(hosts.Host);
                        for (const [key, value] of Object.entries(hosts.Host)) {
                            //console.log(`${key}: ${value}`);
                            if(!isNaN(key)) {
                                _hosts_list.push({
                                    'seq' : key,
                                    'hostname' : value.HostName._value,
                                    'mac' : value.MACAddress._value,
                                    'ip' : value.IPAddress._value,
                                    'type' : value.InterfaceType._value
                                })
                            }
                        }
                    }
                    if(tableLanHostList != null) {
                        tableLanHostList.clear();
                        tableLanHostList.rows.add(_hosts_list).draw();
                    } else {
                        tableLanHostList = $('#table_lan_host_list').DataTable({
                            processing: true,
                            serverSide: false,
                            dom: 'lrtp',
                            order: [[0, 'desc']],
                            data: _hosts_list,
                            columns: [
                                { data: 'seq'},
                                { data: 'hostname' },
                                { data: 'mac' },
                                { data: 'ip' },
                                { data: 'type' }
                            ],
                            onCreateRow: (data) => {
                                //console.log(data);
                            }
                        });
                    }
                    
                } else {
                    
                    //console.log(res);
                }
            })
        })
    }
})
$('#device_wlan_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'wlan';
    //console.log(device_summary_array);
    if(parseInt(device_summary_array[5].split(':')[1]) == 0) {
        alert('Device has no wireless');
        $('#wlan_ssid_5').prop('disabled', true);
        $('#btn_scan_5').prop('disabled', true);
        $('#wlan_ssid_24').prop('disabled', true);
        $('#btn_scan_24').prop('disabled', true);

        $('#wlan_ssid_5').val('');
        $('#wlan_key_5').val('');
        $('#wlan_ssid_24').val('');
        $('#wlan_key_24').val('');
        return 0;
    }
    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.LANDevice.1.WLANConfiguration'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
            if(res.code == 0) {
                //return res.data;
            } else {
                //console.log(res);
            }
        }).then((data) => {
            $.post('/device_get_params', {
                id : data.data.device,
                obj : data.data.objectName
            }, (res) => {
                if(res.code == 0) {
                    let _data = res.data.InternetGatewayDevice.LANDevice[1].WLANConfiguration;
    
                    //console.log(_data[1].AutoChannelEnable);
                    $('#wlan_channel_24').find('option').remove().end()
                        .append('<option value="0">Auto</option>').val('0');
                    $('#wlan_channel_5').find('option').remove().end()
                    .append('<option value="0">Auto</option>').val('0');

                    if(_data[1].PossibleChannels._value) {
                        let channel_list_24 = _data[1].PossibleChannels._value.split(',');
                        if(channel_list_24.length > 0 ) {
                            channel_list_24.forEach(number => {
                                $('#wlan_channel_24').append($('<option>', { 
                                    value: number,
                                    text : number
                                }));
                            })
                        }

                        $('#wlan_ssid_24').val( _data[1].SSID._value);
                        if(!(_data[1].AutoChannelEnable._value == true))
                            $('#wlan_channel_24').val(_data[1].Channel._value);
                        if(_data[1].PreSharedKey[1]) $('#wlan_key_24').val(_data[1].PreSharedKey[1].KeyPassphrase._value);
                        else $('#wlan_key_24').val('');
                    }
                    if(_data[5]){
                        if(_data[5].PossibleChannels._value) {
                            let channel_list_5 = _data[5].PossibleChannels._value.split(',');
                            if(channel_list_5.length > 0 ) {
                                channel_list_5.forEach(number => {
                                    $('#wlan_channel_5').append($('<option>', { 
                                        value: number,
                                        text : number
                                    }));
                                })
                            }

                            if(_data[5].PreSharedKey[1]) $('#wlan_key_5').val(_data[5].PreSharedKey[1].KeyPassphrase._value);
                            else $('#wlan_key_5').val('');
                            $('#wlan_ssid_5').val( _data[5].SSID._value);
                            if(!(_data[5].AutoChannelEnable._value == true))
                            $('#wlan_channel_5').val(_data[5].Channel._value);

                            
                            $('#wlan_ssid_5').prop('disabled', false);
                            $('#btn_scan_5').prop('disabled', false);
                        }
                    } else {
                        $('#wlan_ssid_5').val('Not support');
                        $('#wlan_ssid_5').prop('disabled', true);
                        $('#btn_scan_5').prop('disabled', true);
                    }
                    
                   
                    
                } else {
                    //console.log(res);
                }
            }).then(() => {})
        })              
    }
})

$(document).on('click','#btn_scan_24',() => {
    if(tableWlanNeighbor24 != null) {
        tableWlanNeighbor24.ajax.reload();
    } else {
        tableWlanNeighbor24 = $('#table_wlan_ssid_list_24').DataTable({
            processing: true,
            serverSide: false,
            dom: 'lrtp',
            order: [[2, 'desc']],
            ajax: {
                url: '/wlan_neighbor',
                type: 'POST',
                data:  {
                    id: 1,
                    deviceId: $('#current_device_id').val()
                },
                dataSrc: (data) => {
                    //console.log(data.data[1]['X_ZTE-COM_NeighborAP']);
                    const entries = Object.entries(data.data[1]['X_ZTE-COM_NeighborAP']);
                    var _data = [];
                    entries.forEach((obj) => {
                        //console.log(obj);
                        if(obj[1].SSID) {
                        _data.push({ 
                                    rssi : obj[1].RSSI._value,
                                    ssid : obj[1].SSID._value,
                                    channel : obj[1].Channel._value
                                    })
                        }
                    });
                    return _data;
                }
            },
            columns: [
                { data: 'ssid',
                render: (data) => {
                    if(data == '') return '*hidden*';
                    else return data;
                } },
                { data: 'channel' },
                { data: 'rssi' }
            ],
            onCreateRow: (data) => {
                //console.log(data);
            }
        });
    }
})

$(document).on('click','#btn_scan_5',() => {
    if(tableWlanNeighbor5 != null) {
        tableWlanNeighbor5.ajax.reload();
    } else {
        tableWlanNeighbor5 = $('#table_wlan_ssid_list_5').DataTable({
            processing: true,
            serverSide: false,
            dom: 'lrtp',
            order: [[2, 'desc']],
            ajax: {
                url: '/wlan_neighbor',
                type: 'POST',
                data:  {
                    id: 2,
                    deviceId: $('#current_device_id').val()
                },
                dataSrc: (data) => {
                    //console.log(data.data[1]['X_ZTE-COM_NeighborAP']);
                    const entries = Object.entries(data.data[2]['X_ZTE-COM_NeighborAP']);
                    var _data = [];
                    entries.forEach((obj) => {
                        //console.log(obj);
                        if(obj[1].SSID) {
                        _data.push({ 
                                    rssi : obj[1].RSSI._value,
                                    ssid : obj[1].SSID._value,
                                    channel : obj[1].Channel._value
                                    })
                        }
                    });
                    return _data;
                }
            },
            columns: [
                { data: 'ssid',
                render: (data) => {
                    if(data == '') return '*hidden*';
                    else return data;
                } },
                { data: 'channel' },
                { data: 'rssi' }
            ],
            onCreateRow: (data) => {
                //console.log(data);
            }
        });
    }
})

$('#device_voip_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'voip';
    //console.log(device_summary_array);
    if(parseInt(device_summary_array[7].split(':')[1]) == 0) {
        alert('Device has no Voice port');
        $('#line_1_number').prop('disabled', true);
        $('#line_1_password').prop('disabled', true);
        $('#line_2_number').prop('disabled', true);
        $('#line_2_password').prop('disabled', true);
        $('#proxy_server_ip').prop('disabled', true);

        $('#line_1_number').val('');
        $('#line_1_password').val('');
        $('#line_2_number').val('');
        $('#line_2_password').val('');
        $('#proxy_server_ip').val('0.0.0.0');
        return 0;
    } else {
        $('#line_1_number').prop('disabled', false);
        $('#line_1_password').prop('disabled', false);
        $('#line_2_number').prop('disabled', false);
        $('#line_2_password').prop('disabled', false);
        $('#proxy_server_ip').prop('disabled', false);
    }

    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.Services.VoiceService'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
            if(res.code == 0) {
                //return res.data;
            } else {
                //console.log(res);
            }
        }).then((data) => {
            $.post('/device_get_params', {
                id : data.data.device,
                obj : data.data.objectName
            }, (res) => {
                if(res.code == 0) {
                    let _data = res.data.InternetGatewayDevice.Services.VoiceService[1].VoiceProfile[1];
                    //console.log(_data);
                    //_data.NumberOfLines._value;
                    if(parseInt(device_summary_array[7].split(':')[1]) == 1) {
                        //alert('Device 1 Voip');
                        $('#line_1_status').text( _data.Line[1].Status._value);
                        $('#line_1_number').val( _data.Line[1].SIP.AuthUserName._value);
                        $('#line_1_password').val( _data.Line[1].SIP.AuthPassword._value);
                        
                    } else {
                        $('#line_1_status').text( _data.Line[1].Status._value);
                        $('#line_2_status').text( _data.Line[2].Status._value);
                        $('#line_1_number').val( _data.Line[1].SIP.AuthUserName._value);
                        $('#line_1_password').val( _data.Line[1].SIP.AuthPassword._value);
                        $('#line_2_number').val( _data.Line[2].SIP.AuthUserName._value);
                        $('#line_2_password').val( _data.Line[2].SIP.AuthPassword._value);
                    }
                    
                    
                    $('#proxy_server_ip').val( _data.SIP.ProxyServer._value);
                }
            })
        })
    }

})
$('#device_ddns_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'ddns';
    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.Services.X_ZTE-COM_DDNS'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
            if(res.code == 0) {
                //return res.data;
            } else {
                //console.log(res);
            }
        }).then((data) => {
            $.post('/device_get_params', {
                id : data.data.device,
                obj : data.data.objectName
            }, (_res) => {
                if(_res.code == 0) {
                    //console.log(_res)
                    let _data = _res.data.InternetGatewayDevice.Services['X_ZTE-COM_DDNS'];
                    if(_data.Enable == undefined) {
                        $('#ddns_enable').val('false').trigger('change');
                    } else {
                        $('#ddns_enable').val( _data.Enable._value.toString()).trigger('change');
                        if(_data.ServiceType._value != '') {
                            $('#ddns_provider').val( _data.ServiceType._value).trigger('change');
                        }
                            
                        $('#ddns_hostname').val( _data.Hostname._value);
                        $('#ddns_username').val( _data.Username._value);
                        $('#ddns_password').val( _data.Password._value);
                        $('#ddns_server').val( _data.Server._value);
                    }
                }
            })
        })
    }
})
$('#device_port_forward_link').on("shown.bs.tab", function(evt) {
    current_config_tab = 'port_forward';
    let _post_data = {
        id: 0,
        cn: $('#current_device_id').val(),
        obj : 'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANPPPConnection.2'
    }
    if(_post_data.cn != undefined) {
        $.post('/device_refresh_params', _post_data, (res) => {
            if(res.code == 0) {
                //return res.data;
            } else {
                //console.log(res);
            }
        }).then((data) => {
            $.post('/device_get_params', {
                id : data.data.device,
                obj : data.data.objectName
            }, (_res) => {
                if(_res.code == 0) {
                    //console.log(_res)
                    let _number = _res.data.InternetGatewayDevice.WANDevice[1].WANConnectionDevice[1].WANPPPConnection[2].PortMappingNumberOfEntries._value;
                    //console.log('number of entries = ' + _number);
                    if(_number > 0) {
                        let _data = _res.data.InternetGatewayDevice.WANDevice[1].WANConnectionDevice[1].WANPPPConnection[2].PortMapping;
                        //console.log(_data);
                        $('#tablePortForward tbody').empty();
                        for (const [key, value] of Object.entries(_data)) {
                            if(!isNaN(key)) {
                                //console.log(value);
                                let rowContent = 
                                    "<tr><td>" + key + "</td>" + 
                                    "<td>" + value.ExternalPort._value + "</td>"+
                                    "<td>" + value.InternalPort._value + "</td>"+
                                    "<td>" + value.InternalClient._value + "</td>"+
                                    "<td>" + value.PortMappingEnabled._value + "</td>"+
                                    "<td><button class='btn btn-sm btn-warning btn-edit-port-forward' name='btn_edit_row' data-id=\""+ key + "\">Edit</button><button class='btn btn-sm btn-danger btn-delete-port-forward' name='btn_delete_row' data-id=\""+ key + "\">Delete</button></td></tr>";
                                $("#tablePortForward tbody").append(rowContent);
                            }
                        }
                    }
                }
            })
        })
    }
})

$('input').on('focus', function (e) {
    $(this)
        .one('mouseup', function () {
            $(this).select();
            return false;
        })
        .select();
});
$('#ddns_provider').on('change',function() {
    const select_value = $(this).find(":selected").val();
    switch(select_value) {
        case 'dipc':
            $('#ddns_server').val('http://ns.eagleeyes.com.cn/cgi-bin/gdipupdt.cgi');
            break;
        case 'dyndns':
            $('#ddns_server').val('http://www.dyndns.com');
            break;
        case 'DtDNS':
            $('#ddns_server').val('http://www.dtdns.com');
            break;
        case 'No-IP':
            $('#ddns_server').val('http://www.no-ip.com');
            break;
        default:
            break;
    } 
});
function drawCPE(ctx, 
    cpe_capa = null, 
    cpe_wlan_status = null, 
    cpe_ethernet_status = null,
    cpe_lan_ip_status = null,
    cpe_pon_status = null,
    cpe_voip_status = null,
    cpe_wan_ip = '0.0.0.0'
    ) {

    if(cpe_capa == null ) return 0;
    if(cpe_wlan_status == null ) return 0;
    if(cpe_ethernet_status == null ) return 0;
    if(cpe_lan_ip_status == null ) return 0;
    if(cpe_pon_status == null ) return 0;

    const wlan_status = cpe_wlan_status.split(',');
    const ethernet_status = cpe_ethernet_status.split(',');
    const lan_ip_status = cpe_lan_ip_status.split(',');
    const pon_status = cpe_pon_status.split(',');
    const voip_status = cpe_voip_status.split(',');
    const _status = $('#device_status').val();

    //console.log(wlan_status);
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    const cpe_layout = {
        width: 700,
        height: 200,
        scale: 50,
        main_status : {
            x : (width/5 - 50),
            y : (height/2) - 15
        },
        wan : { x : (width/5-40),
                y : (height/2) + 0
        },
        lan : { x : (width/5) * 1.8,
                y : (height/2) + 0
        },
        wlan : { x : (width/5) * 2.5,
                y : (height/2) - 150
        },
        phone : { x : (width/5) * 3.3,
                y : (height/2) + 0
        },
    }
    if(_status == 'Online') {
        roundedRect(ctx, {
            x: 50,
            y: 100,
            width: cpe_layout.width,
            height: cpe_layout.height,
            radius: 35,
            color: "#00e673",
            fill_color: "white"
        });
    } else {
        roundedRect(ctx, {
            x: 50,
            y: 100,
            width: cpe_layout.width,
            height: cpe_layout.height,
            radius: 35,
            color: "#e60011",
            fill_color: "white"
        });
    }
   
    // Load the sprite sheet from an image file

    const imageUrls = [
        'pub/img/wifi.png',
        'pub/img/wifi_up.png',
        'pub/img/phone.png',
        'pub/img/phone_up.png',
        'pub/img/phone_down.png',
        'pub/img/fiber.png',
        'pub/img/fiber_up.png',
        'pub/img/lan_port.png',
        'pub/img/lan_port_up.png',
        'pub/img/lan_port_down.png'
      ];
      
      const loadImage = url => {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = url;
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        });
      };
      
      Promise.all(imageUrls.map(url => loadImage(url)))
        .then(images => {
          // All images have been loaded
          //console.log(images);

            wifi_image = images[0];
            wifi_up_image = images[1];
            phone_image = images[2];
            phone_up_image = images[3];
            phone_down_image = images[4];
            wan_image = images[5];
            wan_up_image = images[6];
            lan_image = images[7];
            lan_up_image = images[8];
            lan_disable_image = images[9];

            //console.log(cpe_capa);
            // Wait for the sprite sheet to load
            for (const [key, value] of Object.entries(cpe_capa)) {
                switch(key) {
                    case 'WiFi':
                        for(let i = 0; i < value; i++) {
                        //console.log('Draw wifi at' + i * 50);
                        if(wlan_status[i+2] === "Up" || wlan_status[i+1] === "Up") {
                                ctx.drawImage(wifi_up_image,
                                    cpe_layout.wlan.x + (i * 200),
                                    cpe_layout.wlan.y,
                                    cpe_layout.scale,
                                    cpe_layout.scale
                                );
                        } else {
                            ctx.drawImage(wifi_image,
                                    cpe_layout.wlan.x + (i * 200),
                                    cpe_layout.wlan.y,
                                    cpe_layout.scale,
                                    cpe_layout.scale
                                );
                        }
                        
                        
                            ctx.font = "14px Arial";
                            ctx.lineWidth = 3;
                            ctx.fillStyle = "red";
                            
                            if(wlan_status[i+2] === "Up") {
                                ctx.fillText(wlan_status[i + 4],
                                    cpe_layout.wlan.x + (i * 200) + 40,
                                    cpe_layout.wlan.y + 40
                                );
                            } else if(wlan_status[i+1] === "Up") {
                                ctx.fillText(wlan_status[i + 2],
                                    cpe_layout.wlan.x + (i * 200) + 40,
                                    cpe_layout.wlan.y + 40
                                );
                            }
                            ctx.fillText(wlan_status[i],
                                cpe_layout.wlan.x + (i * 200) - 40,
                                cpe_layout.wlan.y + 70
                            );
                        }
                        break;
                    case 'EthernetLAN':
                        let index = [0,3,6,9];
                        //console.log(ethernet_status);
                        let _current_index_status = 0;
                            for(let i = 0; i < value; i++) {
                                _current_index_status = ethernet_status[index[i] + 1];
                                //console.log(_current_index_status);
                                if(_current_index_status == 'Up') {
                                    ctx.drawImage(lan_up_image,
                                            cpe_layout.lan.x + (i * 60),
                                            cpe_layout.lan.y,
                                            cpe_layout.scale,
                                            cpe_layout.scale 
                                    );
                                } else if(_current_index_status == 'Nolink') {
                                        ctx.drawImage(lan_image,
                                            cpe_layout.lan.x + (i * 60),
                                            cpe_layout.lan.y,
                                            cpe_layout.scale,
                                            cpe_layout.scale
                                        );
                                } else if(_current_index_status == 'Disabled') {
                                    
                                        ctx.drawImage(lan_disable_image,
                                            cpe_layout.lan.x + (i * 60),
                                            cpe_layout.lan.y,
                                            cpe_layout.scale,
                                            cpe_layout.scale
                                        );
                                } else {
                                        ctx.drawImage(lan_image,
                                            cpe_layout.lan.x + (i * 60),
                                            cpe_layout.lan.y,
                                            cpe_layout.scale,
                                            cpe_layout.scale
                                        );
                                    
                                }
                            }
                        ctx.font = "14px Arial";
                        ctx.lineWidth = 3;
                        ctx.fillStyle = "blue";
                        ctx.fillText('LAN IP: ' + lan_ip_status[0] ,
                            cpe_layout.lan.x,
                            cpe_layout.lan.y + 70
                        );
                        ctx.fillText('Netmask: '  + lan_ip_status[1] ,
                            cpe_layout.lan.x,
                            cpe_layout.lan.y + 90
                        );
                        ctx.fillText('MAC: '  + lan_ip_status[2],
                            cpe_layout.lan.x,
                            cpe_layout.lan.y + 110
                        );
                        break;
                    case 'PONWAN' :
                                for(let i = 0; i < value; i++) {
                                        if(pon_status[2] === 'Up') {
                                            ctx.drawImage(wan_up_image,
                                                cpe_layout.wan.x + (i * 50)-25,
                                                cpe_layout.wan.y,
                                                cpe_layout.scale,
                                                cpe_layout.scale
                                            );

                                            ctx.font = "14px Arial";
                                            ctx.lineWidth = 3;
                                            ctx.fillStyle = "red";

                                            let pon_mw = [
                                                pon_status[0],
                                                pon_status[1]
                                            ]
                                            const db_power = mw => {
                                                return new Promise((resolve, reject) => {
                                                    const db = 10*Math.log10(mw/10000);
                                                    resolve(db.toFixed(2));
                                                });
                                            }
                                            
                                            Promise.all(pon_mw.map(mw => db_power(mw))).then((dbm) => {
                                                //console.log(dbm);
                                                ctx.fillText('TX: ' + dbm[0] + ' dBm' ,
                                                cpe_layout.wan.x + 30,
                                                cpe_layout.wan.y + 20 );
                                            
                                                ctx.fillText('RX: ' + dbm[1] + ' dBm' ,
                                                    cpe_layout.wan.x + 30,
                                                    cpe_layout.wan.y + 40
                                                );
                                            })
                                            
                                            ctx.fillText('WAN IP: ' + cpe_wan_ip,
                                                cpe_layout.wan.x,
                                                cpe_layout.wan.y + 80
                                            );

                                        } else {
                                            ctx.drawImage(wan_image,
                                                cpe_layout.wan.x + (i * 60),
                                                cpe_layout.wan.y,
                                                cpe_layout.scale,
                                                cpe_layout.scale
                                            );
                                        }
                                        
                        }
                        break;
                    case 'Voip' :
                                    let voip_index = [1, 3];
                                        for(let i = 0; i < value; i++) {
                                            //console.log('Draw phone at y = ' + i * 60);
                                            //console.log('status index = ' + voip_index[i] + ' ' + voip_status[voip_index[i]]);
                                            if(voip_status[voip_index[i]] === 'Up') {
                                                //console.log("draw UP image.")
                                                    ctx.drawImage(phone_up_image,
                                                        cpe_layout.phone.x + 15,
                                                        cpe_layout.phone.y + (i * 50),
                                                        cpe_layout.scale-10,
                                                        cpe_layout.scale-10
                                                    );
                                            } else if(voip_status[voip_index[i]] === 'Error') {
                                                    ctx.drawImage(phone_down_image,
                                                        cpe_layout.phone.x + 15,
                                                        cpe_layout.phone.y + (i * 50),
                                                        cpe_layout.scale-10,
                                                        cpe_layout.scale-10
                                                    );
                                                
                                            } else if(voip_status[voip_index[i]] === 'Disabled') {
                                                ctx.drawImage(phone_down_image,
                                                    cpe_layout.phone.x +15,
                                                    cpe_layout.phone.y + (i * 50),
                                                    cpe_layout.scale-10,
                                                    cpe_layout.scale-10
                                                );
                                            } else {
                                                    ctx.drawImage(phone_image,
                                                        cpe_layout.phone.x +15,
                                                        cpe_layout.phone.y + (i * 50),
                                                        cpe_layout.scale-10,
                                                        cpe_layout.scale-10
                                                    );
                                            }
                                            ctx.font = "14px Arial";
                                            ctx.lineWidth = 3;
                                            ctx.fillStyle = "black";
                                            ctx.fillText(voip_status[i * 2],
                                                cpe_layout.phone.x + 50,
                                                cpe_layout.phone.y + (i * 50) + 25
                                            );
                                            
                                        }
                                        if(value == 1) {
                                            ctx.font = "14px Arial";
                                            ctx.lineWidth = 3;
                                            ctx.fillStyle = "black";
                                            ctx.fillText('SIP server: ' + voip_status[2],
                                                    cpe_layout.phone.x + 35,
                                                    cpe_layout.phone.y + 110
                                            );
                                        } else {
                                            ctx.font = "14px Arial";
                                            ctx.lineWidth = 3;
                                            ctx.fillStyle = "black";
                                            ctx.fillText('SIP server: ' + voip_status[4],
                                                    cpe_layout.phone.x + 35,
                                                    cpe_layout.phone.y + 110
                                            );
                                        }
                                        
                        break;
                    default:
                        break;
                    }
            }

            ctx.font = "18px Arial";
            ctx.lineWidth = 3;
            ctx.fillStyle = "black";
            ctx.fillText($('#device_status').val(),
                cpe_layout.main_status.x,
                cpe_layout.main_status.y
            );
        })
        .catch(error => {
          // An error occurred while loading one or more images
          console.error(error);
        });  
}

function drawCPE_default(ctx) {
    const { width, height } = canvas.getBoundingClientRect();
    
    const cpe_layout = {
        width: 600,
        height: 180,
        scale: 50,
        wan : { x : (width/5),
                y : (height/2) + 30
        },
        lan : { x : (width/5) * 2,
                y : (height/2) + 30
        },
        wlan : { x : (width/5) * 2,
                y : (height/2) + 30
        },
        phone : { x : (width/5) * 4,
                y : (height/2) + 30
        },
    }
    roundedRect(ctx, {
        x: (width / 2) - 300,
        y: (height / 2) - 40,
        width: cpe_layout.width,
        height: cpe_layout.height,
        radius: 35,
        color: "grey",
        fill_color: "white"
    });

    // Wait for the sprite sheet to load
    wifi_image.onload = () => {
        ctx.drawImage(wifi_image,(width / 2),20,50,50);
        ctx.drawImage(wifi_image,(width / 2)+ 200,20,50,50);
    }
    phone_image.onload = () => {
        
        ctx.drawImage(phone_image,(width / 2) + 170,(height/2) + 0,40,40);
        ctx.drawImage(phone_image,(width / 2) + 170,(height/2) + 40,40,40);
    }
    wan_image.onload = () => {
        ctx.drawImage(wan_image,cpe_layout.wan.x ,cpe_layout.wan.y,cpe_layout.scale,cpe_layout.scale);
    }

    lan_image.onload = () => {
        ctx.drawImage(lan_image,(width / 4) + 100,(height/2) + 40,50,50);
        ctx.drawImage(lan_image,(width / 4) + 160,(height/2) + 40,50,50);
        ctx.drawImage(lan_image,(width / 4) + 220,(height/2) + 40,50,50);
        ctx.drawImage(lan_image,(width / 4) + 280,(height/2) + 40,50,50);
    }
    // Load the sprite sheet from an image file
    wifi_image.src = 'pub/img/wifi.png';
    phone_image.src = 'pub/img/phone.png';
    wan_image.src = 'pub/img/fiber.png';
    lan_image.src = 'pub/img/lan_port.png';
}

function roundedRect(ctx, options) {
    ctx.strokeStyle = options.color;
    ctx.fillStyle = options.fill_color;
    ctx.lineJoin = "round";
    ctx.lineWidth = options.radius;

    ctx.strokeRect(
        options.x+(options.radius*.5),
        options.y+(options.radius*.5),
        options.width-options.radius,
        options.height-options.radius
    );

    ctx.fillRect(
        options.x+(options.radius*.5),
        options.y+(options.radius*.5),
        options.width-options.radius,
        options.height-options.radius
    );

    ctx.stroke();
    ctx.fill();
}



