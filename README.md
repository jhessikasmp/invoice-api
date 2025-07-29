# Invoice API

Invoice management system for small and medium-sized businesses. This API allows you to create, manage, and email invoices with automatic PDF document generation.

## Features

- ✅ Customer management
- ✅ Product and service management
- ✅ Invoice creation with automatic calculation of totals and VAT
- ✅ PDF generation for invoices
- ✅ Email delivery of invoices
- ✅ Complete history of all invoices
- ✅ API documentation with Swagger

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- PDFKit (PDF generation)
- Nodemailer (email sending)
- Swagger (API documentation)

## Project Structure

```
invoice-api/
├── src/
│   ├── controllers/      # Application controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routers/          # API routes
│   ├── services/         # Services (PDF, email, etc.)
│   ├── app.js            # Express application configuration
│   ├── logger.js         # Logging configuration
│   └── server.js         # Application entry point
├── temp/                 # Temporary folder for storing PDFs
├── .env                  # Environment variables
└── package.json          # Dependencies and scripts
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jhessikasmp/invoice-api.git
cd invoice-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables by creating a `.env` file in the project root:

```env
# Server
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/invoice-api

# Email (for sending invoices)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-password-or-app-password
EMAIL_FROM=Your Company <your-email@gmail.com>
```

4. Start the server:

```bash
npm start
```

For development, you can use:

```bash
npm run dev
```

## API Endpoints

### Customers

- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Remove customer

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Remove product

### Invoices

- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id/status` - Update invoice status
- `GET /api/invoices/:id/pdf` - Generate and download invoice PDF
- `POST /api/invoices/:id/send` - Send invoice by email

## Documentation

The API has Swagger documentation available at the `/api-docs` endpoint when the server is running.

## Usage Examples

### Create a Customer

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Francesco Rossi",
    "email": "francesco.rossi@email.com",
    "address": {
      "street": "Via Roma, 123",
      "city": "Milano",
      "zipCode": "20121"
    },
    "fiscalCode": "RSSFNC80A01H501X",
    "phone": "+39 02 1234567"
  }'
```

### Create a Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Consulting",
    "description": "Web development consulting service",
    "type": "service",
    "unitPrice": 80.00,
    "unit": "hour",
    "vatRate": 22
  }'
```

### Create an Invoice

```bash
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer_id_here",
    "items": [
      {
        "productId": "product_id_here",
        "quantity": 10
      }
    ]
  }'
```

## 12-Factor App Methodology

This project follows the [12-Factor App](https://12factor.net/) methodology for building modern, scalable, maintainable software-as-a-service applications:

1. **Codebase**: One codebase tracked in revision control, many deploys
2. **Dependencies**: Explicitly declare and isolate dependencies
3. **Config**: Store config in the environment
4. **Backing services**: Treat backing services as attached resources
5. **Build, release, run**: Strictly separate build and run stages
6. **Processes**: Execute the app as one or more stateless processes
7. **Port binding**: Export services via port binding
8. **Concurrency**: Scale out via the process model
9. **Disposability**: Maximize robustness with fast startup and graceful shutdown
10. **Dev/prod parity**: Keep development, staging, and production as similar as possible
11. **Logs**: Treat logs as event streams
12. **Admin processes**: Run admin/management tasks as one-off processes

## Deployment

This application can be easily deployed on [Render](https://render.com), a unified cloud platform for building and running your apps and websites.

### Deployment Steps on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all the required environment variables from your `.env` file
4. Deploy your application

Render automatically handles SSL, scaling, and global CDN distribution, making it an ideal platform for hosting this Invoice API.

## License

This project is licensed under the MIT License.

## Contact

For questions or suggestions, please contact: jhessika.smp@gmail.com
