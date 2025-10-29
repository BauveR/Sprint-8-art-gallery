import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Template IDs para diferentes tipos de correos
const TEMPLATES = {
  PAYMENT_CONFIRMATION: import.meta.env.VITE_EMAILJS_TEMPLATE_PAYMENT || '',
  SHIPMENT_NOTIFICATION: import.meta.env.VITE_EMAILJS_TEMPLATE_SHIPMENT || '',
  DELIVERY_CONFIRMATION: import.meta.env.VITE_EMAILJS_TEMPLATE_DELIVERY || '',
  THANK_YOU: import.meta.env.VITE_EMAILJS_TEMPLATE_THANKYOU || '',
};

// Inicializar EmailJS
emailjs.init(PUBLIC_KEY);

export interface EmailParams {
  to_email: string;
  to_name: string;
  [key: string]: any;
}

/**
 * Enviar email de confirmación de pago
 */
export async function sendPaymentConfirmation(params: {
  to_email: string;
  to_name: string;
  order_id: string;
  total_amount: number;
  items: Array<{ titulo: string; precio: number }>;
}) {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATES.PAYMENT_CONFIRMATION,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        order_id: params.order_id,
        total_amount: params.total_amount.toFixed(2),
        items_list: params.items
          .map((item) => `${item.titulo} - $${item.precio.toFixed(2)}`)
          .join('\n'),
      }
    );
    console.log('Payment confirmation email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
}

/**
 * Enviar email de notificación de envío
 */
export async function sendShipmentNotification(params: {
  to_email: string;
  to_name: string;
  order_id: string;
  tracking_number: string;
  carrier?: string;
  tracking_link: string;
  items: Array<{ titulo: string }>;
}) {
  try {
    console.log('📧 Iniciando envío de email de envío...');
    console.log('📧 Parámetros:', {
      to_email: params.to_email,
      to_name: params.to_name,
      order_id: params.order_id,
      tracking_number: params.tracking_number,
      carrier: params.carrier,
      tracking_link: params.tracking_link,
      items_count: params.items.length,
    });
    console.log('📧 Configuración EmailJS:', {
      SERVICE_ID,
      TEMPLATE_ID: TEMPLATES.SHIPMENT_NOTIFICATION,
      PUBLIC_KEY: PUBLIC_KEY ? '✓ Configurada' : '✗ No configurada',
    });

    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name,
      order_id: params.order_id,
      tracking_number: params.tracking_number,
      carrier: params.carrier || 'Servicio de paquetería',
      tracking_link: params.tracking_link,
      items_list: params.items.map((item) => item.titulo).join(', '),
    };

    console.log('📧 Template params:', templateParams);

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATES.SHIPMENT_NOTIFICATION,
      templateParams
    );

    console.log('✅ Email enviado exitosamente:', {
      status: response.status,
      text: response.text,
      response: response,
    });

    return response;
  } catch (error: any) {
    console.error('❌ Error enviando email de envío:', {
      error: error,
      message: error?.message,
      text: error?.text,
      status: error?.status,
    });
    throw error;
  }
}

/**
 * Enviar email de confirmación de entrega
 */
export async function sendDeliveryConfirmation(params: {
  to_email: string;
  to_name: string;
  order_id: string;
  items: Array<{ titulo: string }>;
}) {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATES.DELIVERY_CONFIRMATION,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        order_id: params.order_id,
        items_list: params.items.map((item) => item.titulo).join(', '),
      }
    );
    console.log('Delivery confirmation email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending delivery confirmation email:', error);
    throw error;
  }
}

/**
 * Enviar email de agradecimiento
 */
export async function sendThankYouEmail(params: {
  to_email: string;
  to_name: string;
  items: Array<{ titulo: string }>;
}) {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATES.THANK_YOU,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        items_list: params.items.map((item) => item.titulo).join(', '),
      }
    );
    console.log('Thank you email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    throw error;
  }
}
