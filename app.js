const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");
const https = require('https');
const fs = require('fs');
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");

// parse and import .env file
require("dotenv").config();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

/*
  Request Logger
*/

app.use((req, res, next) => {
  const { rawHeaders, httpVersion, method, socket, url } = req;
  const { remoteAddress, remoteFamily } = socket;

  console.log(
    JSON.stringify({
      method,
      url,
      timestamp: Date.now(),
      rawHeaders,
      httpVersion,
      remoteAddress,
      remoteFamily,
    })
  );
  next();
});

/*
  Authorization API
*/

app.post(
  "/api/auth/v1/:account_id/protocol/openid-connect/token",
  (req, res, next) => {
    if (req.body.client_id != process.env.AXP_CLIENT_ID)
      res.status(401).send({ error: "Bad credentials" });
    const data = qs.stringify({
      grant_type: req.body.grant_type,
      client_id: req.body.client_id,
      client_secret: process.env.AXP_CLIENT_SECRET,
      refresh_token: req.body.refresh_token,
      username: req.body.username,
      password: req.body.password
    });
    const config = {
      method: "post",
      url: `${process.env.AXP_BASE_URL}/api/auth/v1/${req.params.account_id}/protocol/openid-connect/token`,
      data: data,
      headers: { appkey: req.get('appkey') || process.env.AXP_APP_KEY }
    };
    return axios(config)
      .then(function (response) {
        return res.send(response.data);
      })
      .catch((error) => {
        return res.send(error.response.data);
      });
  }
);

/*
  Update Single User API
*/

app.put(
  "/api/admin/user/v1/accounts/:account_id/users/:user_id",
  (req, res, next) => {
    const config = {
      method: "put",
      url: `${process.env.AXP_BASE_URL}/api/admin/user/v1beta/accounts/${req.params.account_id}/users/${req.params.user_id}`,
      data: req.body,
      headers: { Authorization: req.get("Authorization"), appkey: req.get('appkey') || process.env.AXP_APP_KEY },
    };
    return axios(config)
      .then(function (response) {
        return res.send(response.data);
      })
      .catch((error) => {
        console.log(error);
        return res.send(error.response.data);
      });
  }
);

/*
  Proxy All Other Administartion APIs
*/
const apiProxy = createProxyMiddleware("/api/admin", {
  target: process.env.AXP_BASE_URL,
  changeOrigin: true,
});

/*
  Route Configuration
*/

app.use("/api", apiProxy);

/*
  SSL Configuration & Server Creation
*/

if (process.env.SSL_MODE == "on") {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };

  https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(
      "[SSL MODE ON] Started AXP Auth/Admin API Proxy Server on port: " + process.env.PORT
    );
  });
}
else
  app.listen(process.env.PORT, () => {
    console.log(
      "[SSL MODE OFF] Started AXP Auth/Admin API Proxy Server on port: " + process.env.PORT
    );
  });
