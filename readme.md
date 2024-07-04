# dummy-http-server

```
npx dummy-http-server
```

This a **very simple** dummy-http-server. It accepts any http connection with any http-method (GET, POST, PUT, DELETE). After handling the request, detailed information about this request is printed to STDOUT:
* Timestamp
* HTTP-Method
* HTTP-Version
* Requested URL
* Headers
* Body

### Use cases:
* Development of any client-application which accesses a server.
* Especially: debugging of your client requests if you are developing against an API which you do not control.
* Example: the api-server does not accept your request and you want to debug the conneciton. Therefore you just want to see what your client is sending to the server.

### Design goals & advantages:
* KISS (keep it stupid simple)
* No dependencies (only the built-in node:http module is used)
* Simple usage
* No extras
* Open source


## Usage

### Default config

```
npx dummy-http-server
```

Default configuration:
* Listens on port 8080 on localhost
* Sends response back to client with content-type = 'text/html', body = 'OK', status-code = 200

### Advanced config

#### Sending a custom respsonse

```
npx dummy-http-server --content-type=application/json --response="{\"myMessage\": \"hello\", \"myStatusCode\": \"1234\"}" --response-status=201
```
#### Using a custom hostname and port

```
npx dummy-http-server --port=7000 --hostname=myHostname
```

#### Making the server accessible from the outside (LAN, internet):
Make sure to set the hostname accordingly.
* Step 1: Get your local IP-address (on windows i.e. use `ipconfig`).
* Step 2: Set your IP-address as the hostname (example: your local IP-address is 192.168.5.100): `npx dummy-http-server --port=7000 --hostname=192.168.5.100`
* Step 3: If you want to make the server accessible via the internet, configure your router and firewall (i.e. with a port forwarding) 


## Competitors

### netcat

```
nc -l -p 12345
```
Disadvantage: Will not send any response to the client & only works on linux (MacOS?)

### netcat in a loop

```
while true; do printf 'HTTP/1.1 200 OK\r\n\r\n' | nc -Nl 8000; done
```
Disadvantage: The output is not very well structred & only works on linux (MacOS?)

### Roll your on server (nodejs, Java, Python,...)
Can do; but why to reinvent the wheel?

## License
MIT - see license file