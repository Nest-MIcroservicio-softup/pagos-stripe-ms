import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSessionPagoDto } from './dto/create-session-pago.dto';
import { UpdatePagoDto } from './dto/update-session-pago.dto';
import { envs } from 'src/config';

import Stripe from 'stripe';
import { Request, Response } from 'express';
import { NATS_SERVICE } from 'src/config/services';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class PagosService {

  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger("PagosService");

  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  async createPaymentSession(createSessionPagoDto: CreateSessionPagoDto) {

    const { idOrden, moneda, items } = createSessionPagoDto;

    const lineItems = items.map(item => {
      return {
        price_data: {
          currency: moneda,
          product_data: {
            name: item.nombre,
          },
          unit_amount: Math.round(item.precio * 100),
        },
        quantity: item.cantidad,
      }
    });


    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId: idOrden
        }
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });


    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    }
  }

  async stripeWebHook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    //Real
    const endpointSecret = envs.stripeEndpointSecret;


    try {

      event = this.stripe.webhooks.constructEvent(req['rawBody'], sig, endpointSecret);

    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    //console.log(event);
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;

        const payload ={
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url,
        }

        //this.logger.log({payload});
        this.client.emit('pago.exitoso', payload);
        
        break;
      default:
        console.log(`Evento no manejado: ${event.type}`)
        break;
    }

    return res.status(200).json({ sig });
  }


}
