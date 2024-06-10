const express = require('express');
const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const bodyParser = require('body-parser');
//const { json } = require('body-parser');
var cors = require('cors');
// import { Buffer } from 'buffer';
const { Buffer } = require('buffer');
const { type } = require('os');





const app = express();
app.use(cors());
const port = 3001;




app.get('/generate-label', async (req, res) => {
  //const { username, securedKey, shipmentKey } = req.query;
  const username = 'saswarehouse';
  const securedKey = 'fgX1Jl31FA==.TX3zZ5PdhUoGdeBZn3R/uR09Q1QJ8dlRSQNaz9UiymLOK6mw1Wyc4CwTX83FSutBA8E=';
  const shipmentKey = 'fe10970b-8393-4a07-9481-aba16f797226';
  if (!username || !securedKey || !shipmentKey) {
    return res.status(400).send('Missing required query parameters');
  }

  const soapEnvelope = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lab="http://www.dgis.com/WCF/LabelDiagramService">
    <soapenv:Header/>
    <soapenv:Body>
      <lab:GenerateLabelDiagramByKey>
        <lab:username>${username}</lab:username>
        <lab:securedKey>${securedKey}</lab:securedKey>
        <lab:shipmentKey>${shipmentKey}</lab:shipmentKey>
      </lab:GenerateLabelDiagramByKey>
    </soapenv:Body>
  </soapenv:Envelope>
`;
  //let soapEnvelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:lab="http://www.dgis.com/WCF/LabelDiagramService"><soapenv:Header/><soapenv:Body><lab:GenerateLabelDiagramByKey><lab:username>saswarehouse</lab:username><lab:securedKey>fgX1Jl31FA==.TX3zZ5PdhUoGdeBZn3R/uR09Q1QJ8dlRSQNaz9UiymLOK6mw1Wyc4CwTX83FSutBA8E=}</lab:securedKey<lab:shipmentKey>fe10970b-8393-4a07-9481-aba16f797226</lab:shipmentKey></lab:GenerateLabelDiagramByKey></soapenv:Body></soapenv:Envelope>';
 let url = 'https://mttestws.dgis.com/WService2/LabelDiagramService.svc';
  try {
    console.log('Sending SOAP request...');
    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://www.dgis.com/WCF/LabelDiagramService/ILabelDiagramService/GenerateLabelDiagramByKey'
      }
    });
      // converting the response.data into image

    // console.log('response',response);
    // convert the response.data into base64
     const base64 = Buffer.from(response.data).toString('base64');
     // now we have the base64 string of the image and we can send it to the client side to display the image and to display the image we can use the img tag and set the src attribute to the base64 string
       // sending the base64 string to the client side
       // converting the base64 string into image
           
        //  let image = 'data:image/png;base64,' + base64; // this is the base64 string of the image
        // //  image = image.replace(/(\r\n|\n|\r)/gm, "");
        //   console.log('image',image);
        //   res.send('<img src={image} alt="Your Image">');

        const mimeType = "image/png";

// Create the full data URL
const dataUrl = `data:${mimeType};base64,${base64}`;
// console.log(object.keys(dataUrl)
// );

console.log(dataUrl)
          // let image = 'data:image/png;base64,' + base64;
    
          // Send the HTML with the image embedded
          // res.send(`<img src="${dataUrl}" alt="Your Image">`);
          res.send(dataUrl);
         
  //    console.log('base64',base64);
  //    console.log('type of',typeof base64);
  //   // console.log('responseString',responseString);
  //   console.log('response.statusCode',response.status);
    
  //   // const base64 = response.data; 
  //   // checking type of base64
  //   console.log('typeof base64',typeof base64);
  //   var u8 = new Uint8Array(response.data.length);
  //   for (var i = 0; i < response.data.length; i++) {
  //       u8[i] = response.data[i].charCodeAt(0);
  //   }

  //   // use the Uint8Array so the blob costructor does not change anything
  //  var imageBlob = new Blob([u8], {type:'image/png'});
    
    
  //   res.send(base64);
   
   // res.send(response.data);
   
    // const parsedResponse = await parseStringPromise(response.data);
    // console.log('Parsed response:', parsedResponse);
    // res.bodyParser(parsedResponse);
   
  } catch (error) {
    // let obj = await error.json();
    // console.log('obj',obj);
    // console.log('size',error.response.length);
   
    //res.send(test);
    if (error.response) {
      console.log('error.response.data?>>>>',error.response.data);
      console.log('error.response.status',error.response.status);
      console.log(error.response.headers,'error.response.headers');
      let test = 'error.response.status>>>>>     '+ error.response.status + '>>>>>>>.'+error.response.headers;
      let data = error.response;
      // res.json(error.response);
     // console.log(data,'data');
      //let data = json.toString(error.response);
      console.error('Error response from server:', error.response.data);
      res.status(500).send(`Error making SOAP request: ${data}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      res.status(500).send('No response received from the SOAP server.');
    } else {
      console.error('Error setting up request:', error.message);
      res.status(500).send(`Error setting up SOAP request: ${error.message}`);
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
