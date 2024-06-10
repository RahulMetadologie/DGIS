const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Buffer } = require("buffer");

const app = express();
app.use(cors());
const port = 3001;

app.get("/generate-label", async (req, res) => {
  const username = "saswarehouse";
  const securedKey =
    "fgX1Jl31FA==.TX3zZ5PdhUoGdeBZn3R/uR09Q1QJ8dlRSQNaz9UiymLOK6mw1Wyc4CwTX83FSutBA8E=";
  const shipmentKey = "fe10970b-8393-4a07-9481-aba16f797226";
  if (!username || !securedKey || !shipmentKey) {
    return res.status(400).send("Missing required query parameters");
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

  const url = "https://mttestws.dgis.com/WService2/LabelDiagramService.svc";
  console.log('Sending SOAP request...');
  try {
    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://www.dgis.com/WCF/LabelDiagramService/ILabelDiagramService/GenerateLabelDiagramByKey'
      },
      responseType: 'arraybuffer' // Ensure we get the binary data
    });

    const contentType = response.headers['content-type'];
    console.log("Content-Type:", contentType)
    
    const boundaryMatch = contentType.match(/boundary="(.+?)"/);
    console.log("Boundary Match:", boundaryMatch);
    if (!boundaryMatch) {
      return res.status(500).send("Boundary not found in response");
    }
    const boundary = `--${boundaryMatch[1]}`;
    console.log("Boundary:", boundary);

    // Parse the multipart response
    const rawData = response.data.toString('binary'); // Convert the binary data to a string

    const parts = rawData.split(boundary);

   // Extract the binary part
    const binaryPartIndex = parts[2].indexOf('\r\n\r\n') + 4;
 
    //const binaryData = parts[2].substring(binaryPartIndex, parts[2].lastIndexOf('--')).trim();
    const binaryData = parts[2].substring(binaryPartIndex, parts[2].length).trim();
   // console.log('binaryData',binaryData);
    // console.log("Binary Data:", binaryData);
    const imageBuffer = Buffer.from(binaryData, 'binary');
    let img = `<img src='${imageBuffer}'></img>`;
    res.send(img);
  //   console.log("image buffer",imageBuffer)

  //   // Set response headers and send the image
  //   res.writeHead(200, {
  //     'Content-Type': 'image/png',
  //     'Content-Length': imageBuffer.length
  //   });
  //  res.end(imageBuffer); // it will send the image to the client side
  } catch (error) {
    console.error("Error in generating label:", error);
    res.status(500).send("Error in generating label");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
