// Base 64 algorithm, minified.

let Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

// setup DOM elements.
const fileInput = document.querySelector('#file');
const fileName = document.querySelector('#filename');
const fileLabel = document.querySelector('label[for="file"]');
const passCheck = document.querySelector('#password');
const jsonBtn = document.querySelector('.dlJSON');
const xmlBtn = document.querySelector('.dlXML');

// initiate variables for JSON data and XML data
let jsonData;
let xml;

// File reader
readFile = () => {
  const reader = new FileReader();
  // when file is loaded
  reader.onload = () => {
    fileLabel.innerText = fileInput.files[0].name + " has been converted!";
    fileLabel.style.color = 'green';
    // CSV data
    let csv = reader.result;
    // JSON data after CSV conversion as a String
    let json = CSV2JSON(csv);

    // Assigns JSON data to proper JSON from string.
    let data = JSON.parse(json);
    // Calls the encode function and passes data as an argument.
    encodeData(data);

    // Stringifies the JSON data for downloadable format.
    jsonData = JSON.stringify(data);
    // Enables the JSON download button
    jsonBtn.disabled = false;

    // declare servers variable that will be used to append single server data.
    let servers;
    // assign passwordTag for ES6 script as empty variable.
    let passwordTag;

    // For each element within data, create a XML server snippet
    data.forEach((i) => {
        // if Remove Password is selected, let passwordTag = no password. Otherwise, include Base64 password within ES6 template.
        if (passCheck.checked === true) {
        passwordTag = `<Pass />`;
        } else {
          passwordTag = `<Pass encoding="base64">` + i.password + `</Pass>`;
        }
        // create server based on template and data details.
        let server = `
    <Server>
      <Host>` + i.host + `</Host>
      <Port>` + i.port + `</Port>
      <Protocol>1</Protocol>
      <Type>0</Type>
      <User>` + i.username + `</User>
      `+ passwordTag + `
      <Logontype>1</Logontype>
      <TimezoneOffset>0</TimezoneOffset>
      <PasvMode>MODE_DEFAULT</PasvMode>
      <MaximumMultipleConnections>0</MaximumMultipleConnections>
      <EncodingType>Auto</EncodingType>
      <BypassProxy>0</BypassProxy>
      <Name>` + i.name + `</Name>
      <Comments />
      <Colour>0</Colour>
      <LocalDir />
      <RemoteDir>0 0 ` + i.directory.length + ` ` + i.directory + `</RemoteDir>
      <SyncBrowsing>0</SyncBrowsing>
      <DirectoryComparison>0</DirectoryComparison>
    </Server>`;
    // add snippet to servers
      servers += server;
    });

    // if servers contains 'undefined' replace 'undefined' with nothing, removing undefined.
    if (servers.search('undefined') != -1) {
      servers = servers.replace("undefined", "");
    }

    // Create XML file template
    xml = `<?xml version='1.0' encoding='UTF-8'?>
<FileZilla3>
  <Servers>`
      + servers +
      `
  </Servers>
</FileZilla3>`;

    // Enable XML Download button
    xmlBtn.disabled = false;
  };
  reader.readAsBinaryString(fileInput.files[0]);
}

// Encodes the data specified using Base64 encoding.
function encodeData(data) {
  // iterates through data list and updates encodes the passwords for each item.
  for (i = 0; i < data.length; i++) {
    data[i].password = Base64.encode(data[i].password);
  }
}

// On file selection, run readFile function
fileInput.addEventListener("change", readFile);

// on JSON Download button click, initiate download function for JSON Data
jsonBtn.addEventListener("click", () => {
  if (fileName.value == '') {
    download('data.json', 'data:text/json;charset=utf-8,', jsonData);
  } else {
    download(fileName.value + '_data.json', 'data:text/json;charset=utf-8,', jsonData);
  }
});

// on XML Download button click, initiate download function for XML Data
xmlBtn.addEventListener("click", () => {
  if (fileName.value == '') {
    download('site_import.xml', 'data:text/xml;charset=utf-8,', xml);
  } else {
    download(fileName.value + '_site_import.xml', 'data:text/json;charset=utf-8,', xml);
  }
});

// Re-usable download function, takes a filename, data type and charset, and the data to be used for file contents as arguments
function download(filename, datatype, data) {
  let el = document.createElement('a'); // Create anchor tag DOM element
  el.setAttribute('href', datatype + encodeURIComponent(data)); // set elements HREF attribute to equal passed datatype and file data/contents.
  el.setAttribute('download', filename); // set elements download attribute to the filename provided.
  el.style.display = 'none'; // hides the element from the page
  document.body.appendChild(el); // adds element to the DOM
  el.click(); // clicks the element
  document.body.removeChild(el); // removes the element.
}

// Source: http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.

function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"), "\"");
    } else {
      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return (arrData);
}

function CSV2JSON(csv) {
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      objArray[i - 1][key] = array[i][k]
    }
  }

  objArray.pop(); // removes extra item added prior during array generation
  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");

  return str;
}