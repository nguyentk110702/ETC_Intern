import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductsService) {}

  @SetMetadata('roles', ['ADMIN', 'MANAGER'])
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Session() session: Record<string, any>,
  ) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productService.findAll(search, Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @SetMetadata('roles', ['ADMIN', 'MANAGER'])
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateProductDto>,
  ) {
    return this.productService.update(id, updateData);
  }

  @Delete(':id')
  @SetMetadata('roles', ['ADMIN'])
  async removeSoft(@Param('id') id: number) {
    return this.productService.softDelete(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
