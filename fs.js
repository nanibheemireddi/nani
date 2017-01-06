   fs.open(temp_path, 'r', function (status, fd) {
      if (status) {
          console.log(status.message);
          return;
      }
      var fileSize = getFilesizeInBytes(temp_path);
      var buffer = new Buffer(fileSize);
      fs.read(fd, buffer, 0, fileSize, 0, function (err, num) {

          var query = "INSERT INTO files SET ?",
              values = {
                  file_type: 'img',
                  file_size: buffer.length,
                  file: buffer
              };
          mySQLconnection.query(query, values, function (er, da) {
              if(er)throw er;
          });

      });
  });


fs.open("./public/images/", 'r', function (status, fd) {
      if (status) {
          console.log(status.message);
          return;
      }
      console.log(fd);
      var stats = fs.statSync("./public/images/" + input.image);
      var fileSize = stats["size"];
      console.log(fileSize);
      //var fileSize = GetFileSizeInBytes("./public/images/" + input.image);
      //console.log(fileSize);
      var buffer = new Buffer(fileSize);
      console.log(buffer);
      console.log(buffer.length);
      fs.read(fd, buffer, 0, fileSize, 0, function (err, num) {
          console.log('haiiiiii');
          var query = "INSERT INTO product SET ?",
              values = {
                  Image: buffer
                  //file_size: buffer.length,
                  //file: buffer
                  
              };
              console.log(num);
          connection.query(query, values, function (er, da) {
              if(er) {
                console.log(er);
              }
          
              console.log(da);
              console.log(da);
              console.log(da);
          });
