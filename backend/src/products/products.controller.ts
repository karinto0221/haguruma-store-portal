import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminAuthGuard } from '../common/admin-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // お客様向け・管理画面向け共通の商品一覧(カテゴリ名は非公開情報ではないため公開APIのまま含める)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id/image')
  async findImage(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
    const image = await this.productsService.findImage(id);
    response.set({ 'Content-Type': image.mimeType, 'Cache-Control': 'public, max-age=3600' });
    return new StreamableFile(image.data);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException('指定された商品が見つかりません');
    }
    return product;
  }

  // マスタ管理(商品)。作成・更新・削除は管理者のみ。
  @UseGuards(AdminAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @Put(':id/image')
  @UseInterceptors(FileInterceptor('image', { limits: { fileSize: 5 * 1024 * 1024 } }))
  updateImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.productsService.updateImage(id, file);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
