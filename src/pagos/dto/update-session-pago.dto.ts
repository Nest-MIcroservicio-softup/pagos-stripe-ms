import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionPagoDto } from './create-session-pago.dto';

export class UpdatePagoDto extends PartialType(CreateSessionPagoDto) {}
