# EmailJS Configuration Guide

This guide explains how to set up EmailJS for sending automated emails in the art gallery system.

## Prerequisites

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Verify your email address
3. Set up your email service (Gmail, Outlook, etc.)

## Step 1: Create Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (e.g., Gmail)
4. Follow the authentication steps
5. Note down your **Service ID**

## Step 2: Create Email Templates

You need to create 4 templates for different email notifications:

### Template 1: Payment Confirmation
**Template ID:** `VITE_EMAILJS_TEMPLATE_PAYMENT`

**Subject:** Order Confirmation - {{order_id}}

**Body:**
```
Hola {{to_name}},

¡Gracias por tu compra!

Tu pedido #{{order_id}} ha sido confirmado y está siendo procesado.

Resumen del pedido:
{{items_list}}

Total: ${{total_amount}} USD

Recibirás un correo con la información de envío una vez que tu pedido sea despachado.

Saludos,
Equipo de Galería de Arte
```

### Template 2: Shipment Notification
**Template ID:** `VITE_EMAILJS_TEMPLATE_SHIPMENT`

**Subject:** Tu pedido ha sido enviado - {{order_id}}

**Body:**
```
Hola {{to_name}},

¡Buenas noticias! Tu pedido #{{order_id}} ha sido enviado.

Obras enviadas: {{items_list}}

Información de seguimiento:
Número de seguimiento: {{tracking_number}}
Link de seguimiento: {{tracking_link}}

Puedes hacer seguimiento de tu envío en el link proporcionado.

Saludos,
Equipo de Galería de Arte
```

### Template 3: Delivery Confirmation
**Template ID:** `VITE_EMAILJS_TEMPLATE_DELIVERY`

**Subject:** Tu pedido ha sido entregado - {{order_id}}

**Body:**
```
Hola {{to_name}},

Tu pedido #{{order_id}} ha sido entregado exitosamente.

Obras entregadas: {{items_list}}

Esperamos que disfrutes de tu nueva adquisición. Si tienes alguna pregunta o problema, no dudes en contactarnos.

Saludos,
Equipo de Galería de Arte
```

### Template 4: Thank You Email
**Template ID:** `VITE_EMAILJS_TEMPLATE_THANKYOU`

**Subject:** Gracias por tu compra

**Body:**
```
Hola {{to_name}},

Queremos agradecerte por elegir nuestra galería de arte.

Obras adquiridas: {{items_list}}

Tu apoyo significa mucho para nosotros y para los artistas que representamos.

Esperamos verte pronto en nuestra galería.

Saludos,
Equipo de Galería de Arte
```

## Step 3: Get API Keys

1. Go to **Account** in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)
3. Note down your **Public Key**

## Step 4: Configure Environment Variables

Update the `.env.local` file with your credentials:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_TEMPLATE_PAYMENT=your_payment_template_id
VITE_EMAILJS_TEMPLATE_SHIPMENT=your_shipment_template_id
VITE_EMAILJS_TEMPLATE_DELIVERY=your_delivery_template_id
VITE_EMAILJS_TEMPLATE_THANKYOU=your_thankyou_template_id
```

## Step 5: Restart Development Server

After updating the environment variables, restart your development server:

```bash
npm run dev
```

## Email Flow

The system automatically sends emails at the following stages:

1. **Payment Confirmation**: Sent immediately after successful payment
2. **Shipment Notification**: Sent when admin updates order status to "enviado" (with tracking info)
3. **Delivery Confirmation**: Sent when admin updates order status to "entregado"
4. **Thank You**: Sent after delivery confirmation

## Testing

Use EmailJS test mode to verify your templates are working correctly before going live.

## Troubleshooting

- **Emails not sending**: Check browser console for errors
- **Wrong template data**: Verify template variable names match the ones in the code
- **Authentication errors**: Re-verify your email service in EmailJS dashboard
- **Rate limits**: EmailJS free tier has a limit of 200 emails/month

## Notes

- All emails are sent from the frontend using EmailJS browser SDK
- Emails are sent asynchronously and won't block the payment flow
- If email sending fails, it will be logged to console but won't affect the order
