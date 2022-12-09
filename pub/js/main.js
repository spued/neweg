var ne_table = null;

window.addEventListener('load', function() {
    //console.log('All assets are loaded');
    ne_table = $('#ne_table').DataTable(
        {
            processing: true,
            serverSide: false,
            ajax: {
                url: '/list_ne',
                type: 'POST',
            },
            data: {},
            columns: [
                { data : null,
                    render : function(data, type, full, meta) {
                      return meta.row + 1;
                    }
                },
                { data: 'NE_Name',
                    render: function(data) {
                        return data.slice(0,3);
                    }        
                },
                { data: 'ne_count' }
            ],
            createdRow: function(row, data) {
                //console.log(row);
            },
            initComplete : function(setting,data) {
                //console.log(data)
            }
        }
    );
    
});