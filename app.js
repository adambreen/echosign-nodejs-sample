var
  fs     = require('fs'),
  util   = require('util'),
  https  = require('https'),
  http   = require('http'),
  pdf    = fs.readFileSync('./test.pdf').toString('base64'),
  dust   = require('dustjs-linkedin'),
  xml2js = require('xml2js'),
  parser = new xml2js.Parser()
;

parser.addListener('end', function(result) {
    // console.dir(result['soap:Envelope']['soap:Body']);
    console.log(util.inspect(result, false, null))
});


var
  template         = fs.readFileSync('./sendDocument.xml').toString(),
  compiledTemplate = dust.compile(template, 'sendDocument')
;

dust.loadSource(compiledTemplate);


var options = {
  host: '127.0.0.1',
  port: 65001,
  path: '/services/EchoSignDocumentService15',
  method: 'POST',
  headers: { "Content-Type": "text/xml; charset=utf-8"}
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  res.setEncoding('utf8');

  var buffers = [];

  res.on('data', function (chunk) {
    buffers.push(chunk);
  });

  res.on('end', function () {
    var body = Buffer.concat(buffers).toString();
    parser.parseString(body);
  });
});


req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
// req.write('data\n');
// req.end();


var model = {
  file     : pdf,
  filename : 'test.pdf',
  message  : 'Blah blah blah...',
  emailTo  : 'testsign@adambreen.com'
};

dust.render('sendDocument', model, function (err, output){
  req.write(output);
  req.end();

});


// req.pipe(dust.stream('sendDocument'), model);

// dust.stream("index", context)
//     .on("data", function(data) {
//       console.log(data);
//     })
//     .on("end", function() {
//       console.log("I'm finished!");
//     })
//     .on("error", function(err) {
//       console.log("Something terrible happened!");
//     })
//   ;




// var sendDocumentRequest =
// { apiKey: 'P6H4S54GT4445U',
//   senderInfo:
//    { email: 'sleipner@adambreen.com',
//      password: 'P3r3$troika10' },
//   documentCreationInfo:
//    { recipients: [ { email: 'adam@adambreen.com', role: 'SIGNER' }],
//      name: 'test signing',
//      fileInfos: [ { fileName: 'test.pdf', file: pdf} ],
//      signatureType: 'ESIGN',
//      signatureFlow: 'SENDER_SIGNATURE_NOT_REQUIRED'
// 	}
//  };