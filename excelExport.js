module.exports.excel = function(req,res){
    var nodeExcel=require('excel-export');
    //var dateFormat = require('dateformat');
    var conf={}
    conf.cols=[{
            caption:'taxId',
            type:'number',
            width:3
        },
        {
            caption:'name',
            type:'string',
            width:50
        },
        {
            caption:'percentage',
            type:'string',
            width:15
        }
        ];
    req.getConnection(function(err,connection){
        var query=connection.query("select * from tax_master where taxId="+req.params.id,function(err,rows){
            arr=[];
            console.log(rows);
            for(i=0;i<rows.length;i++){
                name=rows[i].name;
                taxId = rows[i].taxId;
                percentage = rows[i].percentage;
                //a=[i+1,job,(dateFormat(rows[i].add_date*1000, "dd/mm/yyyy"))];
                a = [taxId,name,percentage];
                arr.push(a);
                }
                conf.rows=arr;
    var result=nodeExcel.execute(conf);
    console.log(result);
    res.setHeader('Content-Type','application/vnd.openxmlformates');
    res.setHeader("Content-Disposition","attachment;filename="+"tax.xlsx");
    res.end(result,'binary');
            });
    });
}



