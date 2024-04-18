import { Module } from '@nestjs/common';
import { PagosModule } from './pagos/pagos.module';
import { HealthCheckModule } from './health-check/health-check.module';



@Module({
  imports: [PagosModule, HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
