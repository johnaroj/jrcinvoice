const InvoicePaymentOverdue = ({
  clientName,
  contactLink,
  unsubscribeLink,
}: {
  clientName: string;
  contactLink?: string;
  unsubscribeLink?: string;
}) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #3b82f6, #1e40af);
        border-radius: 12px;
        width: 50px;
        height: 50px;
        margin: 0 auto 10px;
      }
      .logo-icon img {
        width: 30px;
        height: 30px;
      }
      .company-name {
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
      .content {
        text-align: center;
        margin-bottom: 20px;
      }
      .content h2 {
        color: #ff0000;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .content p {
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
      }
      .button-container {
        text-align: center;
        margin-bottom: 30px;
      }
      .button {
        display: inline-block;
        padding: 15px 30px;
        background-color: #3b82f6;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        font-size: 16px;
      }
      .button:hover {
        background-color: #2563eb;
      }
      .footer {
        background-color: #333;
        color: #fff;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      .footer a {
        color: #3b82f6;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote">
            <rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
          </svg>
        </div>
        <div class="company-name">JRCInvoice</div>
      </div>
      <div class="content">
        <h2>Warning! Invoice payment is overdue!!!</h2>
        <p>
          Hey ${clientName}, we hope you are doing well. We have noticed that
          you haven't paid the invoice yet. So we wanted to remind you! If you
          encounter any problems with the invoice, please contact us using the
          big blue button below!
        </p>
        <div class="button-container">
          <a href="${contactLink}" class="button">Contact us</a>
        </div>
      </div>
      <div class="footer">
        © JRCInvoice • van Adrichemweg 320 • Rotterdam, 3011, Netherlands <br />
        <a href="${unsubscribeLink}">Unsubscribe</a>
      </div>
    </div>
  </body>
</html>
`;

export default InvoicePaymentOverdue;
