module.exports = save;
var fs = require('fs');
var path = require('path');
function save(htmlText,pathToSaveImg = path.join(path.join(process.cwd(), 'images')) , baseUrl = '' ,append = true) {
    var htmlWithImgUrls  = htmlText.replace(/src=\"data:([^\"]+)\"/gi,function(matches){
        var splitted =  (matches).split(';');
        var contentType = splitted[0];
        var encContent = splitted[1];
        var imgBase64 = encContent.substr(6);
        if (encContent.substr(0,6) != 'base64') {
          return matches;
        }
        var imgFilename = imgBase64.substr(1,8).replace(/[^\w\s]/gi, '') + Date.now() + String(Math.random() * (900000000)).replace('.',''); // Generate a unique filename
        var imgExt = '';
        switch(contentType.split(':')[1]) {
            case 'image/jpeg': imgExt = 'jpg'; break;
            case 'image/gif': imgExt = 'gif'; break;
            case 'image/png': imgExt = 'png'; break;
            default: return matches; 
        }
        if (!fs.existsSync(pathToSaveImg)){
            fs.mkdirSync(pathToSaveImg);
        }
        var imgPath = path.join(pathToSaveImg,imgFilename+'.'+imgExt);
        var base64Data = encContent.replace(/^base64,/, "");
        fs.writeFile(imgPath, base64Data, 'base64', function(err) {
          console.log(err); // Something went wrong trying to save Image
        });
        if(baseUrl){
            var formattedBaseUrl = (((baseUrl[baseUrl.len - 1]) == '/')? baseUrl : (baseUrl+'/'));
        }
        else{
            var formattedBaseUrl = './';
        }
        if (append){
            return 'src="'+formattedBaseUrl+pathToSaveImg+'/'+imgFilename+'.'+imgExt+'"';
        }
        if (!append){
            return 'src="'+formattedBaseUrl'/'+imgFilename+'.'+imgExt+'"';
        }
        
    });
    return htmlWithImgUrls;
}