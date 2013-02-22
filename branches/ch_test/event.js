 document.getElementById('save').addEventListener('click', function() {
        /*
         * since the stage toDataURL() method is asynchronous, we need
         * to provide a callback
         */
        scatterStage.toDataURL({ //save stage
          callback: function(dataUrl) {
            /*
             * here you can do anything you like with the data url.
             * In this tutorial we'll just open the url with the browser
             * so that you can see the result as an image
             */
            window.open(dataUrl);
          }
        });
        histStage.toDataURL({ //save stage1
            callback: function(dataUrl1) {
              /*
               * here you can do anything you like with the data url.
               * In this tutorial we'll just open the url with the browser
               * so that you can see the result as an image
               */
              window.open(dataUrl1);
            }
          });
      }, false);   
    document.getElementById('showSelected').addEventListener('click', function() {
      //   msgShow = true;
        //   writeMsg(msgLayer);
           document.getElementById('msgContainer').style.visibility = 'visible'; 
      }, false);   
   
    document.getElementById('hideSelected').addEventListener('click', function() {
   //     msgShow = false;
    //      msgLayer.clear();
          document.getElementById('msgContainer').style.visibility = 'hidden'; 
     }, false);   
   