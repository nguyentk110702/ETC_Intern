import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateVarianDto } from './dto/createVariant.dto';
import { ProductVariantService } from './productVariant.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(AuthGuard)
@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @SetMetadata('roles', ['ADMIN', 'MANAGER'])
  @Post(':productId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          const fileName = `variant-${Date.now()}.${ext}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async createProductVariant(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() createVarianDto: CreateVarianDto,
  ) {
    if (file) {
      createVarianDto.image = file.filename;
    }
    createVarianDto.idProduct = productId;
    return this.productVariantService.createProductVariantWithAttributes(
      createVarianDto,
    );
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
