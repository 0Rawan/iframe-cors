var express = require('express')
var app = express()
var https = require('https');
var http = require('http');
const { response } = require('express');


app.use('/', function(clientRequest, clientResponse) {
    console.log(clientRequest.originalUrl)
    var url;
    url = 'http://www.trendyol.com'
    var parsedHost = url.split('/').splice(2).splice(0, 1).join('/')
    var parsedPort;
    var parsedSSL;
    if (url.startsWith('https://')) {
        parsedPort = 443
        parsedSSL = https
    } else if (url.startsWith('http://')) {
        parsedPort = 80
        parsedSSL = http
    }
    var options = { 
      hostname: parsedHost,
      port: parsedPort,
      path: clientRequest.url,
      method: clientRequest.method,
      headers: {
        'User-Agent': clientRequest.headers['user-agent']
      }
    };  
  
    var serverRequest = parsedSSL.request(options, function(serverResponse) { 
      var body = '';   
      if(serverResponse){  
      if (String(serverResponse.headers['content-type']).indexOf('text/html') !== -1) {
        serverResponse.on('data', function(chunk) {
          body += chunk;
        }); 
  
        serverResponse.on('end', function() {
          // Make changes to HTML files when they're done being read.
          body = body.replace(`example`, `Cat!` );
  
          clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
          clientResponse.end(body);
        }); 
      }   
      else {
        serverResponse.pipe(clientResponse, {
          end: true
        }); 
        clientResponse.contentType(serverResponse.headers['content-type'])
      }
      }
    }); 
  
    serverRequest.end();
  });    

  const port = process.env.PORT || 9000;  
  app.listen(port)
 
