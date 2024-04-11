import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator";

export class CreateSessionPagoDto {
    
    @IsString()
    idOrden: string;
    
    @IsString()
    moneda: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each:true})
    @Type(() => PaymentSessionItemDto)
    items:PaymentSessionItemDto[];
}


export class PaymentSessionItemDto{

    @IsString()
    nombre: string;

    @IsNumber()
    @IsPositive()
    precio: number;

    @IsNumber()
    @IsPositive()
    cantidad: number;

}
