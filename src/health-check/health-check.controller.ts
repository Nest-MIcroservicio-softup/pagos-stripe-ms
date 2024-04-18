import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
    @Get()
    getHealthCheck() {
        return 'Payments Webhook is up and running!';
    }
}
