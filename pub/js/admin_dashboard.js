var prefixBarChart = undefined;

window.addEventListener('load', function() {
    //console.log('All assets are loaded');
    drawGraph();
    $.post('/dashboard_devices_prefixes',{}, (_res) => {
        //console.log(res.data);
        
        $.each(_res.data, function (i, item) {
            $('#select_prefix').append($('<option>', {
                value: item._id,
                text : item._id
            }));
        });
    })

    $.post('/dashboard_devices_group',{
        prefix : 0
    }, (res) => {
        
        console.log(res.data);
        prefixBarChart.canvas.parentNode.style.height = '480px';
        prefixBarChart.canvas.parentNode.style.width = '480px';

        prefixBarChart.data.labels= res.data.map((ele) => {
            return ele._id;
        });
        prefixBarChart.data.datasets[0].data = res.data.map((ele) => {
            return ele.count;
        });

        prefixBarChart.update();
        let html = "";
        $("#tableDeviceGroup tbody").append();
        let _total = 0;
        res.data.forEach(element => {
            html +="<tr><td>" + element._id + "</td><td>" + element.count + "</td></tr>";
            _total+= element.count;
        });
        html +="<tr><td>Total</td><td>" + _total + "</td></tr>";
        
        $("#tableDeviceGroup tbody").append(html);
    })
});

$('#select_prefix').on('change',(evt) => {
    $.post('/dashboard_devices_group',{
        prefix : $('#select_prefix').val()
    }, (res) => {
        
        prefixBarChart.canvas.parentNode.style.height = '480px';
        prefixBarChart.canvas.parentNode.style.width = '480px';

        prefixBarChart.data.labels= res.data.map((ele) => {
            return ele._id;
        });
        prefixBarChart.data.datasets[0].data = res.data.map((ele) => {
            return ele.count;
        });

        prefixBarChart.update();
        $("#tableDeviceGroup tbody").empty();
        let html = "";
        $("#tableDeviceGroup tbody").append();
        let _total = 0;
        res.data.forEach(element => {
            html +="<tr><td>" + element._id + "</td><td>" + element.count + "</td></tr>";
            _total += element.count;
        });
        html +="<tr><td>Total</td><td>" + _total + "</td></tr>";
        $("#tableDeviceGroup tbody").append(html);
    })
})

function drawGraph() {
    var ctx = document.getElementById('bar-chart').getContext('2d');
    prefixBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['p1', 'p2', 'p3', 'p4'],
            datasets: [{
                label: 'CPE Type',
                data: [12, 12, 12, 12],
                backgroundColor: [
                    '#1F8A70',
                    '#FC7200',
                    '#473C33',
                    '#00425A'
                ],
                borderColor: [
                    '#1F8A70',
                    '#FC7200',
                    '#473C33',
                    '#00425A'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                
                y: {
                beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio : false 
        }
    });
}
