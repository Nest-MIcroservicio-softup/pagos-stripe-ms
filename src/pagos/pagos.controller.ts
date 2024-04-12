import { Controller, Get, Post,  Req, Res } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreateSessionPagoDto } from './dto/create-session-pago.dto';
import { Response, Request } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  //@Post('crear-sesion-pago')
  @MessagePattern('crear.sesion.pago')
  createPaymentSession(@Payload() createSessionPagoDto: CreateSessionPagoDto) {
       
    return this.pagosService.createPaymentSession(createSessionPagoDto);
  }

  @Get('pago-exitoso')
  success() {
    return {
      ok:true,
      message: 'Pago exitoso'
    }
  }

  @Get('pago-cancelado')
  cancel() {
    return {
      ok:false,
      message: 'Pago cancelado'
    }
  }

  @Post('webhook')
  async webhook(@Req() req:Request, @Res() res:Response){
    return this.pagosService.stripeWebHook(req,res);
  }
}
