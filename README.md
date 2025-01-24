# Project Setup Guide
- example output
<img src="./view/img.png">
This guide will help you set up the frontend, backend, and Envoy server proxy for your project.

### Prerequisites
Make sure you have the following tools installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Envoy Proxy](https://www.envoyproxy.io/)

---

## 1. Setting Up the Frontend

Follow the steps below to start the frontend server:

1. **Open a terminal** on your machine.

2. **Navigate to the `client` directory** where the frontend code is located:

   ```bash
   cd client
   ```

3. **Install the required dependencies**:

   ```bash
   npm install
   ```

4. **Start the frontend server**:

   ```bash
   npm start
   ```

   The frontend application should now be running locally. You can access it by navigating to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Setting Up the Backend

Follow the steps below to start the backend server:

1. **Open a new terminal window** (separate from the frontend).

2. **Navigate to the backend directory** (or wherever your backend code is located):

   ```bash
   cd backend
   ```

3. **Install the necessary dependencies**:

   ```bash
   npm install
   ```

4. **Start the backend server in development mode**:

   ```bash
   npm run dev
   ```

   The backend service will now be running. Typically, the backend will listen on [http://localhost:50051](http://localhost:50051), but check your backend code for the exact address.

---

## 3. Setting Up the Envoy Proxy Server

Envoy is used to proxy requests between the frontend and backend, typically for services like gRPC-Web.

Follow these steps to set it up:

1. **Open another terminal window** at the root of your project (where your main `server` or configuration files are located).

2. **Run the Envoy Proxy server** with the following command:

   ```bash
   ./grpcwebproxy --backend_addr=localhost:50051 --backend_tls_noverify --run_tls_server=false --allow_all_origins
   ```

   - `--backend_addr=localhost:50051`: Specifies the address of your backend service.
   - `--backend_tls_noverify`: Disables TLS verification for the backend (useful for development).
   - `--run_tls_server=false`: Disables TLS on the proxy server (useful for development).
   - `--allow_all_origins`: Allows requests from any origin (typically used in development, but not recommended for production).

3. The proxy server will now be running and accepting connections between the frontend and backend.

---

## Summary

To run the entire project:

- **Frontend**: 
  - Run `npm start` in the `client` folder.
  
- **Backend**:
  - Run `npm run dev` in the `backend` folder.

- **Envoy Proxy**:
  - Run the `grpcwebproxy` command in the root directory to handle communication between the frontend and backend.

