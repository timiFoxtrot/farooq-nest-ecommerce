import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseBoolPipe,
  Query,
  Req,
  HttpException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ErrorResponse, SuccessResponse } from 'src/common/helpers/response';
import { Roles } from 'src/auth/role.decorator';
import { RequestWithUser, USER_ROLES } from 'src/auth/auth.interfaces';
import { SkipAuth } from 'src/auth/auth.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles([USER_ROLES.USER])
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const user = req.user;
      const response = await this.productsService.create(
        createProductDto,
        user,
      );
      return SuccessResponse('Product Created Successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error || 'Unable to create product',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Get()
  @Roles([USER_ROLES.USER, USER_ROLES.ADMIN])
  async findAll(@Req() req: RequestWithUser) {
    try {
      const response = await this.productsService.findAll(req.user);
      return SuccessResponse('Products fetched successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error || 'Unable to fetch products',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Get('approved')
  @SkipAuth()
  async getApprovedProducts() {
    try {
      const response = await this.productsService.getApprovedProducts();
      return SuccessResponse('Approved product fetched successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error || 'Unable to fetch approved products',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Patch(':id')
  @Roles([USER_ROLES.USER])
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      // if (req.user.role !== USER_ROLES.ADMIN) {
      //   delete updateProductDto.isApproved;
      // }
      if (req.body.hasOwnProperty('isApproved')) {
        throw new HttpException(
          'You are not allowed to update this field',
          HttpStatus.FORBIDDEN,
        );
      }
      const response = await this.productsService.update(
        req.user,
        id,
        updateProductDto,
      );
      return SuccessResponse('Product updated Successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error.message || 'Unable to update product',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Get(':id')
  @Roles([USER_ROLES.USER, USER_ROLES.ADMIN])
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.productsService.findOne('query', id);
      return SuccessResponse('Product fetched successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error || 'Unable to fetch product',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Delete(':id')
  @Roles([USER_ROLES.USER, USER_ROLES.ADMIN])
  async remove(@Param('id') id: string) {
    try {
      const response = await this.productsService.remove(id);
      return SuccessResponse('Product deleted successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error || 'Unable to delete product',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Patch('/approval/:id')
  @Roles([USER_ROLES.ADMIN])
  async updateProductApprovalStatus(
    @Param('id') id: string,
    @Query('approve', ParseBoolPipe) approve: boolean,
  ) {
    try {
      console.log({ approve });
      const response = await this.productsService.updateProductApprovalStatus(
        id,
        approve,
      );
      return SuccessResponse('Product status updated successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error || 'Unable to update product status',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
