import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PagosController],
  providers: [PagosService],
  imports: [
    NatsModule
  ],
})
export class PagosModule {}
