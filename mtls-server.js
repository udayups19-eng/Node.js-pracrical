// mtls-server.js
const https = require("https");
const fs = require("fs");
const path = require("path");

// Paths to certificates
const certFiles = {
  key: path.join(__dirname, "server.key"),
  cert: path.join(__dirname, "server.crt"),
  ca: path.join(__dirname, "ca.crt"),
};

// Function to load the latest TLS certificates
function loadCertificates() {
  return {
    key: fs.readFileSync(certFiles.key),
    cert: fs.readFileSync(certFiles.cert),
    ca: fs.readFileSync(certFiles.ca),
    requestCert: true,        // Ask clients for a certificate
    rejectUnauthorized: true, // Reject clients without valid certs
  };
}

let tlsOptions = loadCertificates();

// Create HTTPS server
const server = https.createServer(tlsOptions, (req, res) => {
  // Check if client provided a valid certificate
  const clientCert = req.socket.getPeerCertificate();
  if (req.client.authorized) {
    res.writeHead(200);
    res.end(`✅ Hello, ${clientCert.subject.CN}! You are authorized.\n`);
  } else {
    res.writeHead(401);
    res.end("❌ 401 Unauthorized - No valid client certificate.\n");
  }
});

// Watch for certificate file changes
Object.values(certFiles).forEach((file) => {
  fs.watchFile(file, () => {
    console.log(`🔄 Certificate file changed: ${file}`);
    try {
      tlsOptions = loadCertificates();
      server.setSecureContext(tlsOptions);
      console.log("✅ TLS certificates reloaded successfully!");
    } catch (err) {
      console.error("❌ Failed to reload certificates:", err);
    }
  });
});

server.listen(8443, () => {
  console.log("🚀 mTLS Server running on https://localhost:8443");
});
