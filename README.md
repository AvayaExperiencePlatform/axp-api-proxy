# AXP API Proxy (A&A and Admin)

A backend component for Authorization with AXP, as well as proxying the Admin API requests, any APIs under the base path `/api/admin`

## Installation (Native)

The backend component is a simple `Node.js` server using `Express`, just receiving the request from the widget and proxying it to AXP, as well as holding the client secret to not expose it in the browser.

To run the backend component `(axp-proxy-api)`

- Update the `.env` file with your credentials and AXP base URL, for example:
  - ```env
    AXP_CLIENT_ID=YOUR_AXP_CLIENT_ID
    AXP_CLIENT_SECRET=your-very-complex-axp-client-secret
    AXP_BASE_URL=https://eu.api.avayacloud.com # API Base URL - Format should follow region.api.avayacloud.com
    AXP_APP_KEY=your-axp-api-key
    PORT=3001 #The port this Server will run on
    SSL_MODE=on # value should be 'on' if HTTPS enabled or 'off' if diasbled
    SSL_CERT_PATH=/etc/nginx/cert.pem
    SSL_KEY_PATH=/etc/nginx/key.pem
    ```
- Run `npm install` to install the libraries and package dependencies.
- Run `node app.js` to run the server.

## Docker-ized Build & Deploy (Recommended)

  You must have Docker & Docker Compose running in order to proceed with the below steps.

#### Setup
- Follow the same steps mentioned above for updating the `.env` file
- Make sure if you have SSL on to have the certificates/keys in the `secrets` folder.
  - (Optional) if you have them in another location on the host machine, you can update the docker-compose file and mount them on the paths configured in the `.env` file
- If you updated the PORT in the `.env` file, update the `Dockerfile.dev` file and change the PORT to the one you chose.

### Docker Build
- Run the following command to build your Docker image.

  $ docker build -f Dockerfile.dev -t axp-api-proxy:latest .

### Docker Compose
- Update the Ports in the `docker-compose-dev.yml` file to the port you configured in the `.env` file.
- Run the following command to deploy your container.

  $ docker-compose up -c docker-compose-dev.yml -d

- To uninstall you can run (in the same folder)

  $ docker-compose down


