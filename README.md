M-PESA STK Push Function
This project contains a Node.js implementation of the M-PESA STK Push functionality using the Safaricom Daraja API. The STK Push API allows businesses and developers to initiate M-PESA payment requests from users through an STK (Sim Toolkit) push notification sent to the user’s mobile device. The user is prompted to enter their M-PESA PIN to authorize the payment.

Copy code
git clone https://github.com/your-repository-url
Install the dependencies using npm.

Copy code
npm install
Create a .env file in the root of the project and add the following environment variables:


Copy code
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PAYBILL=your_paybill_or_till_number
MPESA_PASSKEY=your_passkey
How It Works
The STK Push function triggers a payment request to M-PESA by sending a POST request to the Safaricom STK Push API. Here’s a high-level breakdown of how the function works:

Generate Access Token: The function first generates an access token using your consumer key and secret. This token is used to authenticate the STK push request.

Prepare STK Push Request: After acquiring the access token, the function prepares the necessary parameters, including the business short code (paybill or till number), transaction timestamp, and a Base64-encoded password (a combination of the short code, passkey, and timestamp).

Send STK Push Request: The function sends a POST request to the M-PESA STK Push API, which initiates the payment request to the user’s mobile device.

User Confirmation: The user receives a push notification on their phone, enters their M-PESA PIN, and completes the transaction.

STK Push Request Structure
The STK Push request is sent with the following body:


Copy code
{
  "BusinessShortCode": "your_short_code",
  "Password": "generated_password",
  "Timestamp": "current_timestamp",
  "TransactionType": "CustomerPayBillOnline",
  "Amount": "amount_to_pay",
  "PartyA": "customer_phone_number",
  "PartyB": "your_short_code",
  "PhoneNumber": "customer_phone_number",
  "CallBackURL": "https://your-callback-url",
  "AccountReference": "your_account_reference",
  "TransactionDesc": "description_of_the_transaction"
}
BusinessShortCode: Your Paybill or Till number.
Password: Base64-encoded value of your short code + passkey + timestamp.
Timestamp: A timestamp generated during the transaction.
TransactionType: Either CustomerPayBillOnline for paybill transactions or CustomerBuyGoodsOnline for buy goods.
Amount: The amount of money the customer will pay.
PartyA: The customer’s phone number.
PartyB: The same as the business short code.
PhoneNumber: The customer’s phone number, which will receive the STK push.
CallBackURL: Your server’s URL to receive payment confirmation.
AccountReference: An identifier for the transaction.
TransactionDesc: A brief description of the transaction.
Usage
To initiate an STK Push request, send a POST request to /stk:


License
This project is free for use

This README description provides clarity on what the STK function does, how to use it, and details on the expected request structure. It also includes information on setting up the environment and initiating the function.
