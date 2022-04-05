const cheerio = require('cheerio');
const express = require('express')
var app = express()
const https = require('https');
const http = require('http');
const { response } = require('express');


app.get('/', function(clientRequest, clientResponse) {
    console.log(clientRequest.originalUrl)
    var url;
    url = 'https://www.trendyol.com'
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

      if (String(serverResponse.headers['content-type']).indexOf('text/html') !== -1) {
        serverResponse.on('data', function(chunk) {
          body += chunk;
        }); 
  
        serverResponse.on('end', function() {
          // Make changes to HTML files when they're done being read.
          //console.log(typeof body)
          //body = body.replace(`example`, `Cat!` );
          //var substr = body.substring(body.indexOf('<head>'));
          
          
          //manipulate html "body" with cheerio
          const $ = cheerio.load(body)
          $('body').prepend('<h1>hello world</h1>');
          
          //check if gender popup is active
          
         
          clientResponse.writeHead(serverResponse.statusCode, serverResponse.headers);
          
          clientResponse.write('<!doctype html>');
          clientResponse.write('<html lang="tr-TR">');
          clientResponse.write('<h1>Hello, World!</h1>');
          clientResponse.end(body);
        }); 
      }   
      else {
        serverResponse.pipe(clientResponse, {
          end: true
        }); 
        clientResponse.contentType(serverResponse.headers['content-type'])
      }   
    }); 
  
    serverRequest.end();
  });    


  const port = process.env.PORT || 9000;  
  app.listen(port)
 
