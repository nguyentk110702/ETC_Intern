import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateVarianDto } from './dto/createVariant.dto';
import { ProductVariantService } from './productVariant.service';

@UseGuards(AuthGuard)
@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @SetMetadata('roles', ['ADMIN', 'MANAGER'])
  @Post()
  async createProductVariant(@Body() body: CreateVarianDto) {
    return this.productVariantService.createProductVariantWithAttributes(body);
  }

  @Get(':productId')
  async getProductVariantByProductId(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.productVariantService.getProductVariantByProductId(productId);
  }

  @SetMetadata('roles', ['ADMIN'])
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productVariantService.remove(id);
  }
}
