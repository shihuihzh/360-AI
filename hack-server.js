const http = require('http')
const fs = require('fs')
const url = require('url');

// function to random 6 digits
function random6() {
  return Math.floor(100000 + Math.random() * 900000)
}

const fileContents = {
  "sys.json": `{ "first_wake_bind": 1, "is_xiaobao": 0, "is_bind": 1, "volume": 6, "server": "http:\/\/127.0.0.1", "business_server": "http:\/\/127.0.0.1", "did": "", "kg_token": "", "kg_userid": 0, "kg_vip": 0, "vad_mod": "LOCALCLOUD", "cmccToken": "", "cmccUserKey": "", "cmccDeviceId": "", "cmccGwCoapAddr": "", "cmccGwMqttAddr": "", "cuccTel": "", "cuccAreaCode": "" }` ,
  "bt_settings": `[General]\nDiscoverable=true\nAlias=360 AI音箱-M1-${random6()}`,
  "bt_a2dpsink.json": `{ "version": "1.00", "autoconnect_num": 2, "autoconnect_mode": 1, "devices": [] }`,
  "wpa_supplicant.conf": `ctrl_interface=DIR=/var/run/wpa_supplicant\nupdate_config=1\nnetwork={\n\tssid="ssi"\n\tscan_ssid=1\n\tpsk="password"\n}` }

const fileServer = ' http://hackx.me:81'
const server = http.createServer((request, response) => {
  var pathname = url.parse(request.url).pathname;
  console.log(`${new Date().toLocaleString()} [info] remote=${request.socket.remoteAddress}, path=${pathname}`)

  const content = fileContents[pathname.substring(pathname.lastIndexOf("/")+1)]??'';
  if (!content) {
    console.error(`${new Date().toLocaleString()} [info] content not found`)
    request.socket.destroy()
  }

  response.writeHead(200, {'Content-Type': 'text/plain'});    
  response.write(content)
  response.end()
})

server.listen('81', () => {
  console.log(`file server serve at ${fileServer}`)
})

// socket server for run shell every 2ms if no blocking
const shellFile = process.env["SHELL_FILE"]
let shell = `
bdaddr=\$(cat /data/bluetooth/bdaddr)
curl -o /data/ai360_cfg/sys.json ${fileServer}/sys.json 
curl -o /data/bluetooth/config/\${bdaddr}/settings ${fileServer}/bt_settings
curl -o /data/bluetooth/bt_a2dpsink.json ${fileServer}/bt_a2dpsink.json
#curl -o /data/system/wpa_supplicant.conf ${fileServer}/wpa_supplicant.conf
`.trim()
require('net').createServer(function (socket) {
    console.log(`${new Date().toLocaleString()} [info] ${socket.remoteAddress} connected`);

    shell = shellFile ? fs.readFileSync(shellFile).toString() : shell
    console.info(`${new Date().toLocaleString()} [info] going to run shell {`);
    console.error(`${shell.trim()}`)
    console.info(`}`)
    socket.write(shell, () => {
      socket.destroy()
    })
}).listen(80)
