var province_ne_table = null;
var province_rx_table = null;
var pon_onu_table = null;
var nc_onu_table = null;
var nc_onu_history_table = null;

var current_province = null;
var master_info = null;
var master_id_data = null;
var active_master_pon_count = [];
var previous_master_pon_count = [];

var pon_count_data = [{ 'pon_name': '-','pon_aarx': '0', 'good' : 0, 'bad' : 0 }];
var pon_onu_data = [{ 'onu_id': 0, 'name' : '-', 'rx' : 0 }];
var onu_nc_data = [{ 'onu_id': 0, 'NRSSP': '-' , 'name' : '-', 'rx' : 0, 'aarx' : 0 }];
var onu_nc_history_data = [{ 'pon_quantity': 0, 'previous': 0 , 'current' : 0}];

var master_id_list = [];
var loadingModal =  $('#loadingModal');

$(document).ajaxStart(function(){
  $('#loadingModal').modal('show');
});
$(document).ajaxStop(function(){
  $('#loadingModal').modal('hide');
});

$(function() {
  $("#rx_table").hide();
  $("#current_prefix").val($(".btn-province:first-of-type").attr('prefix'));
  $("#province_label").text($(".btn-province:first-of-type").text());
  if(province_ne_table != null) province_ne_table.destroy();
  province_ne_table = $('#province_ne_table').DataTable({
    processing: true,
    serverSide: false,
    order: [[1, 'asc']],
    ajax: {
        url: '/list_pon',
        type: 'POST',
        data: { 
          prefix : function() { 
            return $("#current_prefix").val() 
          } 
        }
    },
    columns: [
        { data : null,
          render : function(data, type, full, meta) {
            return meta.row + 1;
          }
        },
        { data: 'NE_Name' },
        { data: 'ne_count' }
    ],
  });

  province_rx_table = $('#province_rx_table').DataTable({
    processing: true,
    data:  pon_count_data ,
    columns: [
        { data: 'pon_name' },
        { data: 'pon_aarx' },
        { data: 'good' },
        { data: 'bad' }
    ],
    createdRow: function (rows, data) {
      //console.log(data);
    }
  });

  pon_onu_table = $('#pon_onu_table').DataTable({
    //processing: true,
    data:  pon_onu_data ,
    order: [[1, 'desc']],
    columns: [
        { data: 'onu_id' },
        { data: 'name' },
        { data: {},
          render: (data) => {
            let html = '';
            if((data.rx - data.aarx) < (-2)) {
              html='<i class="text text-danger">'+data.rx+'</i>';
            } else {
              html='<i class="text text-success">'+data.rx+'</i>';
            }
            return html;
          } }
    ],
    drawCallback: () => {
    }
  });
  let _dom = 'lfrtip';
  if($('#user_type').val() == 'admin') _dom = 'Blfrtip';
  nc_onu_table = $('#nc_onu_table').DataTable({
    processing: true,
    serverSide: false,
    scrollY : true,
    scrollY : "400px",
    order: [[4, 'desc']],
    data:  onu_nc_data ,
    dom:  _dom,
    buttons: [
      'copyHtml5',
      'excelHtml5',
      'csvHtml5',
      'pdfHtml5'
    ],
    columns: [
      { data: 'onu_id' },
      { data: 'NRSSP' },
      { data: 'name' },
      { data: 'aarx' },
      { data: 'rx' }
    ],
    drawCallback: () => {
    }
  });
  nc_onu_history_table = $('#nc_onu_history_table').DataTable({
    processing: true,
    serverSide: false,
    scrollY : true,
    scrollY : "400px",
    data:  onu_nc_history_data ,
    columns: [
        { data: 'pon_quantity' },
        { data: 'previous' },
        { data: 'current' },
        { data: {},
          render:(data) => {
            return data.current - data.previous;
          } 
        }
    ],
    drawCallback: () => {
    }
  });
  const user_right = $('#user_right').val();
  var r = parseUserRightToButton(user_right);
  $('.province-button').append(r);
  drawGraph();
  
});
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
          class : "btn btn-info btn-province",
          prefix: _button[1]
        }).text(_button[0]))
        }
      })
    }
    return buttons;
  }
}
$('#province_rx_table').on('click', 'tbody td', function() {
  //get textContent of the TD
  //console.log('TD cell textContent : ', this.textContent)
  pon_onu_data = [];
  let data = province_rx_table.row(this).data();
  $("#ponName").text(data.pon_name + ' @RX ' + data.pon_aarx);
  $.post('/list_master_id', { prefix: $("#current_prefix").val() }, function(res) {
    //console.log(res);
    master_ids = res;
    for(item of res.data) {
      master_id_list.push(item.id);
    }
  }).done(() => {
    //console.log(master_id_list);
    $.post('/rx_pon_onu', { 
      nrssp: data.pon_name,
      master_id: JSON.stringify(master_id_list),
    }, function(res) {
      //console.log(res.data[0]);
      res.data[0].forEach((item) => {
        //console.log(item);
        pon_onu_data.push({
          onu_id : item.ONU_ID,
          name: item.Name,
          rx: item.Received_Optical_Power,
          aarx: data.pon_aarx
        });
      })
      pon_onu_table.clear().rows.add(pon_onu_data).draw();
      $("#ponONUModal").modal('show');
    })
  })
  
});

$(".btn-pon-list").on("click", function() {
  let _prefix =  $("#current_prefix").val();
  if(_prefix == 'default') {
    alert('ให้กดเลือกข้อมูลจังหวัดก่อน');
    return 0;
  } else {
    showProvinceRXTable();
  }
})

$(".btn-nc-list").on("click", function() {
  let _prefix =  $("#current_prefix").val();
  //console.log("get nc list for " + _prefix);
  if(_prefix == 'default') {
    alert('ให้กดเลือกข้อมูลจังหวัดก่อน');
    return 0;
  }
  else {
    $("#nc_onu_prefix").text(_prefix + " : " + current_province);
    onu_nc_data = [];
    let _promises = [];
    _promises.push(
      $.post('/list_nc_onu', {
        prefix : _prefix,
        master_id : 0
      } , function(_res) {
        //console.log(res.data);
        _res.data.forEach(_item => {
          onu_nc_data.push(_item);
        })
      })
    );
  
    Promise.all(_promises).then(() => {
      //console.log(onu_nc_data);
      nc_onu_table.clear().rows.add(onu_nc_data).draw();
      nc_onu_table.columns.adjust();
      $('.dataTables_scrollHeadInner, .dataTable').css({'width':'100%'})
      $("#ncONUModal").modal('show');
    })
  }
});

$(".btn-nc-history").on("click", function() {
  let _prefix =  $("#current_prefix").val();
  //console.log("get nc list for " + _prefix);
  
  if(_prefix == 'default') {
    alert('ให้กดเลือกข้อมูลจังหวัดก่อน');
    return 0;
  }
  else
    $.post('/list_nc_history_onu', {
      prefix : _prefix
    } , function(_res){
      //console.log(_res.data);
      let diff = _res.data[0].current - _res.data[0].previous;

      $("#nc_onu_province_history_table > thead > tr > th:nth-child(3)").text('ครั้งก่อน ' +_res.data[0].prev_date);
      $("#nc_onu_province_history_table > thead > tr > th:nth-child(4)").text('ล่าสุด ' +_res.data[0].curr_date);

      $("#nc_onu_province_history_table > tbody > tr > td:nth-child(1)").text(_res.data[0].pon_quantity);
      $("#nc_onu_province_history_table > tbody > tr > td:nth-child(2)").text(_res.data[0].curr_onu_count);
      $("#nc_onu_province_history_table > tbody > tr > td:nth-child(3)").text(_res.data[0].previous);
      $("#nc_onu_province_history_table > tbody > tr > td:nth-child(4)").text(_res.data[0].current);
      $("#nc_onu_province_history_table > tbody > tr > td:nth-child(5)").text(diff);
      $("#provinceHistoryONUModal").modal('show');
      $('#province_history_onu_prefix').text(_prefix + " : " + current_province);
      
    })
});

$(".btn-nc-all-history").on("click", function() {
  let _prefix =  $("#current_prefix").val();
  //console.log("get nc list for " + _prefix);
  onu_nc_history_data = [];
  if(_prefix == 'default') {
    alert('ให้กดเลือกข้อมูลจังหวัดก่อน');
    return 0;
  }
  else
    $.post('/list_nc_history_onu', {
      prefix : _prefix
    } , function(_res){
      console.log(_res.data);
      onu_nc_history_data = _res.data;
      //console.log(onu_nc_history_data);
      $(nc_onu_history_table.columns(1).header()).text(_res.data.prev_date);
      nc_onu_history_table.clear().rows.add(onu_nc_history_data).draw();
      nc_onu_history_table.columns.adjust();
      $('.dataTables_scrollHeadInner, .dataTable').css({'width':'100%'})
      $("#provinceHistoryONUModal").modal('show');
      $('#history_onu_prefix').text(_prefix);
      
    })
});

$(document).on("click",".btn-province",function() {
  let prefix = $(this).attr('prefix');
  //console.log("Search for province prefix = " + prefix);
  
  $("#current_prefix").val(prefix);
  $("#province_label").text($(this).text());
  current_province = $(this).text();

  $.post('/list_master_id', { prefix: $("#current_prefix").val().trim() }, function(res) {
    //console.log(res);
    master_ids = res;
  });
  drawGraph();
  $("#rx_table").hide();
  province_ne_table.ajax.reload();
  $("#ne_table").show();
})

function showProvinceRXTable() {
  $("#ne_table").hide();
  $("#rx_table").hide();
  pon_count_data = [];
  //console.log(res);
  let promises = [];

  promises.push(
    $.post('/rx_count_pon', { 
      master_id: 0 ,
      prefix: $("#current_prefix").val() 
    }, function(_res) {
      //console.log(_res.data);
      _res.data.forEach((item) => {
        //console.log(item);
        pon_count_data.push(item);
      })
    })
  );
     
  Promise.all(promises).then(() => {
    
    province_rx_table.clear().rows.add(pon_count_data).draw();
    province_rx_table.columns.adjust();
    $("#rx_table").show();
  });
}

$('#ponONUModal').on('click', 'button.close', function (eventObject) {
  $('#ponONUModal').modal('hide');
});

$('#ncONUModal').on('click', 'button.close', function (eventObject) {
  $('#ncONUModal').modal('hide');
});

$('#historyONUModal').on('click', 'button.close', function (eventObject) {
  $('#historyONUModal').modal('hide');
});

$('#provinceHistoryONUModal').on('click', 'button.close', function (eventObject) {
  $('#provinceHistoryONUModal').modal('hide');
});

const graph_profile = {
  labels: [
    'Good',
    'Not conform'
  ],
  datasets: [{
    label: 'A@RX ONU graph',
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
    onClick: clickHandler,
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
const rxChart = new Chart(document.getElementById('rxChart'), graph_config);

function clickHandler(evt) {
  const points = rxChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
  if (points.length) {
      const firstPoint = points[0];
      const label = rxChart.data.labels[firstPoint.index];
      const value = rxChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
      //console.log(label , value);
      if(label.startsWith('Not conform')) { 
        showProvinceRXTable();
      } else {
        showProvinceRXTable();
      }
  }
}
function drawGraph() {
    //console.log(res);
    var promises = [];
    let good = bad = 0;
    promises.push(
      $.post('/rx_count_onu', { 
        master_id: 0 ,
        prefix: $("#current_prefix").val() 
      }, function(_res) {
        //console.log(_res);
        good = _res.data.good;
        bad = _res.data.bad;
      })
    );
    Promise.all(promises).then(() => {
      //console.log(good,bad);
      if(good != undefined) {
        rxChart.data.datasets[0].data = [good, bad];
        rxChart.data.labels = ['Good = ' + good, 'Not conform = ' + bad];
        rxChart.update();
        rxChart.show();
      }
    });
}



