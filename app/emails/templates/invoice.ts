const Invoice = ({
  clientName,
  invoiceNumber,
  dueDate,
  totalAmount,
  downloadLink,
}: {
  clientName: string;
  invoiceNumber: string;
  dueDate: string;
  totalAmount: string;
  downloadLink: string;
}) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #f8f9fa;
      }
      .logo {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 30px 0;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #0066cc;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        margin: 20px 0;
      }
      .button:hover {
        background-color: #0052a3;
      }
      .footer {
        text-align: center;
        padding: 20px;
        background-color: #f8f9fa;
        font-size: 12px;
        color: #666666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Invoice for ${clientName}</h2>
      <p>Dear ${clientName},</p>
      <p>
        I hope this email finds you well. Here are the details of your invoice:
      </p>
      <ul>
        <li>Invoice Number: ${invoiceNumber}</li>
        <li>Due Date: ${dueDate}</li>
        <li>Total Amount: ${totalAmount}</li>
      </ul>
      <p>You can download your invoice by clicking the button below:</p>
      <a href="${downloadLink}" class="button">Download Invoice</a>
      <p>Thank you for your business!</p>
    </div>
  </body>
</html>
`;

export default Invoice;
