360 AI
--------------------------

- Turn on bluetooth and no need connect to server.
- Run any command you want via hacking server.

### Mode of Hack Server
#### Patch Mode
* Box will download files and execute patch scripts
```
node hack-server.js
```

#### SSH Mode
* Box will download ssh server and run it.
* Try `ssh -p2222 {box-ip}` to access it
```
SSH=1 node hack-server.js
```



#### Run any Shell More
* Load local `shell scripts` file and run it
```
SHELL_FILE=any-shell.sh node hack-server.js
```
