# AXP API Proxy (A&A and Admin)

A backend component for Authorization with AXP, as well as proxying the Admin API requests, any APIs under the base path `/api/admin`.

---

## :warning: **Disclaimer**

> :bulb: This sample application is provided **for demonstration purposes only** and is not intended for production use. We assume no responsibility for any issues arising from its use.

---

## Installation (Native)

The backend component is a `Node.js` server using `Express`. It proxies requests to AXP and securely manages the client secret.

To run the backend component `(axp-proxy-api)`:

- Update the `.env` file with your credentials and AXP base URL. Example:
  ```env
  AXP_CLIENT_ID=YOUR_AXP_CLIENT_ID
  AXP_CLIENT_SECRET=your-very-complex-axp-client-secret
  AXP_BASE_URL=https://eu.api.avayacloud.com # API Base URL - Format should follow region.api.avayacloud.com
  AXP_APP_KEY=your-axp-api-key
  PORT=3001 # The port this Server will run on
  SSL_MODE=on # Value should be 'on' if HTTPS enabled, 'off' if disabled
  SSL_CERT_PATH=/etc/nginx/cert.pem
  SSL_KEY_PATH=/etc/nginx/key.pem
    ```
- Run `npm install` to install dependencies.
- Run `node app.js` to run the server.

## Dockerized Build & Deploy (Recommended)

  Docker & Docker Compose are required for the following steps.

#### Setup
- Update the `.env` file as mentioned above.
- If using SSL, ensure certificates/keys are in the `secrets` folder or update the `docker-compose` file to mount them correctly.
- If the PORT in the `.env` file is changed, update it in the `Dockerfile.dev` file.

### Docker Build
- Build the Docker image with the following command:
  ```sh
  docker build -f Dockerfile.dev -t axp-api-proxy:latest .
  ```

### Docker Compose
- Update the ports in `docker-compose-dev.yml` to match the configured port.
- Deploy the container with:
  ```sh
  docker-compose up -c docker-compose-dev.yml -d
  ```
- To uninstall, run:
  ```sh
  docker-compose down
  ```

