var tx_onu_table = null;
var loadingModal =  $('#loadingModal');

$(document).ajaxStart(function(){
    //$('#loadingModal').modal('show');
});
$(document).ajaxStop(function(){
    //$('#loadingModal').modal('hide');
});
window.addEventListener('load', function() {
    //console.log('All assets are loaded');
    const user_right = $('#user_right').val();
    var r = parseUserRightToButton(user_right);
    $('.province-button').append(r);

    tx_onu_table = $('#tx_onu_table').DataTable(
        {
            processing: true,
            serverSide: false,
            scrollY : '400px',
            order: [[0, 'asc']],
            ajax: {
                url: '/tx_get_nc_onu',
                type: 'POST',
                data: {
                    prefix : function() {
                        return $("#current_prefix").val() 
                    }
                }
            },
            columns: [
                { data : {},
                    render:(data) => {
                        return data.NE_Name+'-'+data.Rack+'-'+data.Shelf+'-'+data.Slot+'-'+data.Port;
                    }
                },
                { data: 'ONU_ID' },
                { data: 'ONU_Configured_Type' },
                { data: 'MAC_SN' },
                { data: 'Name' },
                { data: 'Transmitted_Optical_Power' }
            ],
            createdRow: function(row, data) {
                //console.log(data);
            },
            initComplete : function(setting,data) {
            },
            drawCallback: function(setting,data) {
                //console.log(data);
                
            }
        }
    );
    
});

$(document).on("click",".btn-province",function() {
    let prefix = $(this).attr('prefix');
    //console.log("Search for province prefix = " + prefix);
    
    $("#current_prefix").val(prefix);
    $("#province_name").text($(this).text());
    current_province = $(this).text();
    tx_onu_table.ajax.reload();
   
   $.post('/tx_count_onu', { prefix: $("#current_prefix").val() }, function(res) {
        console.log(res.data);
        txChart.data.datasets[0].data = [res.data.good, res.data.bad];
        txChart.data.labels = ['Good = ' + res.data.good, 'Not conform = ' + res.data.bad];
        txChart.update();
        txChart.show();
    });
  })

function parseUserRightToButton(data) {
    let province = null;
    let buttons = [];
    if(!data) {
      return 0;
    } else {
      province = data.split(',');
      if(province.length) {
        province.forEach(function(item) {
          let _button = item.split(':');
          if(_button.length >= 2) {
            buttons.push($('<button/>').attr({
            class : "btn btn-success btn-province",
            prefix: _button[1]
          }).text(_button[0]))
          }
        })
      }
      return buttons;
    }
}

const graph_profile = {
    labels: [
      'Good',
      'Not conform'
    ],
    datasets: [{
      label: 'TX ONU graph',
      backgroundColor: [
        'rgb(10, 190, 10)',
        'rgb(252, 136, 3)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4,
      data: [100, 100]
    }]
  };
  
  const graph_config = {
    type: 'doughnut',
    data: graph_profile,
    options: {
      //onClick: clickHandler,
      plugins: {
        legend: {
            display: true,
            labels: {
                color: 'rgb(0, 0, 0)'
            }
        }
      }
    }
  };
const txChart = new Chart(document.getElementById('txChart'), graph_config);
