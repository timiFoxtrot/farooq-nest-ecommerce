import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IReqUser, USER_ROLES } from 'src/auth/auth.interfaces';
import { paginate } from 'src/common/pagination/paginate';
import { defaultPage, defaultSize } from 'src/utils/constant-util';
import { QueryDto } from './dto/query-products.dto';
// import { IReqUser, USER_ROLES } from 'src/auth/auth.interfaces';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
  ) {}
  async create(productInput: CreateProductDto, user: IReqUser) {
    const product = this.productsRepository.create({
      ...productInput,
      user_id: user.id,
    });
    const createdProduct = await this.productsRepository.save(product);

    if (!createdProduct) {
      throw new HttpException(
        'Unable to create product at the moment, try again later!',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return createdProduct;
  }

  async getApprovedProducts(searchParams: QueryDto) {
    const options = {
      where: {
        isApproved: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isApproved: true,
        user_id: true,
        user: {
          id: true,
          name: true,
        },
      },
      relations: {
        user: true,
      },
    };

    if (searchParams.paginate === 'true') {
      const data = await paginate<ProductEntity>(
        this.productsRepository,
        {
          size: Number(searchParams?.limit) || defaultSize,
          page: Number(searchParams?.page) || defaultPage,
        },
        options,
      );
      return data;
    } else {
      const data = await this.productsRepository.find(options);
      return { data };
    }
  }

  async updateProductApprovalStatus(id: string, approve: boolean) {
    const updatedProduct = await this.productsRepository.update(id, {
      isApproved: approve,
    });
    return updatedProduct;
  }

  async findAll(searchParams: QueryDto, user: IReqUser) {
    const query = user.role === USER_ROLES.USER ? { user_id: user.id } : {};
    const options = {
      where: query,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        isApproved: true,
        user_id: true,
        user: {
          id: true,
          name: true,
        },
      },
      relations: {
        user: true
      }
    };

    if (searchParams.paginate === 'true') {
      const data = await paginate<ProductEntity>(
        this.productsRepository,
        {
          size: Number(searchParams?.limit) || defaultSize,
          page: Number(searchParams?.page) || defaultPage,
        },
        options,
      );
      return data;
    } else {
      const data = await this.productsRepository.find(options);
      return { data };
    }
  }

  async findOne(user_id: string, id: string) {
    const userProduct = await this.productsRepository.findOne({
      where: {
        id,
        user_id,
      },
    });

    if (!userProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return userProduct;
  }

  async update(user: IReqUser, id: string, updateProductDto: UpdateProductDto) {
    const userProduct = await this.findOne(user.id, id);

    const productUpdate = { ...userProduct, ...updateProductDto };
    const updatedProduct = await this.productsRepository.save(productUpdate);
    return updatedProduct;
  }

  async remove(id: string) {
    const deletedProduct = await this.productsRepository.delete(id);
    return deletedProduct;
  }
}
