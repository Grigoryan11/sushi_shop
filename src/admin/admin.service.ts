import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../db/entities/product.entity';
import { Repository } from 'typeorm';
import file from '../auth/admin_auth/admin.json';
import { ProductDto } from './dto/product.dto';
import * as fs from 'fs';
import { SlideEntity } from '../db/entities/slide.entity';
import { SlideDto } from './dto/slide.dto';
import { UpdateDto } from './dto/update.dto';
import { BonusDto } from './dto/bonus.dto';
import { BonusEntity } from '../db/entities/bonus.entity';
import { userEntity } from '../db/entities/user.entity';
import { CartEntity } from '../db/entities/cart.entity';
import { CartItemEntity } from '../db/entities/cart-Item.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(SlideEntity)
    private readonly slideRepo: Repository<SlideEntity>,
    @InjectRepository(BonusEntity)
    private readonly bonusRepo: Repository<BonusEntity>,
    @InjectRepository(userEntity)
    private readonly userRepo: Repository<userEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepo: Repository<CartItemEntity>,
  ) {}

  async getProducts() {
    const product = await this.productRepo.find();
    if (!product) {
      throw new HttpException('This product cant found', 404);
    }
    return {
      data: product,
    };
  }

  async getProduct(type: string, language: string) {
    const data = await this.productRepo.find({
      where: {
        type: type,
        language: language,
      },
    });
    if (!data) {
      throw new HttpException('This product cant found', 404);
    }
    return {
      message: 'success',
      data: data,
    };
  }

  async addProducts(image, payload: ProductDto, currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const user = currentUser.payload.email;
    if (user == file.email) {
      const data = await this.productRepo.save({
        ...payload,
        image: image.path,
      });
      return {
        message: 'Success',
        data: data,
      };
    } else {
      throw new HttpException('Unauthorized!', 401);
    }
  }

  async deleteProduct(id: number, currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const user = currentUser.payload.email;
    if (user == file.email) {
      const product = await this.productRepo.findOne({ id });
      if (product) {
        await this.productRepo.delete({ id });
        fs.unlink(product.image, (err) => {
          console.log(err);
        });
        return {
          message: 'Success',
        };
      } else {
        throw new HttpException('Product not found!!!', 404);
      }
    }
  }

  public async updateProduct(id: number, payload: UpdateDto) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      throw new HttpException('Product not found!!!', 404);
    }
    const data = await this.productRepo.update({ id }, payload);
    if (data && data.affected > 0) {
      return {
        message: 'success',
        data: await this.productRepo.findOne(id),
      };
    }
    return {
      message: 'Data not updated!',
      data: [],
    };
  }

  public async updateProductImage(id: number, image) {
    const product = await this.productRepo.findOne(id);
    if (!product) {
      await fs.unlink(image.path, (err) => {
        console.log(err);
      });
      throw new HttpException('Product not found!!!', 404);
    }
    const data = await this.productRepo.update({ id }, { image: image.path });
    if (data && data.affected > 0) {
      await fs.unlink(product.image, (err) => {
        console.log(err);
      });
      return {
        message: 'success',
        data: await this.productRepo.findOne(id, image),
      };
    }
    return {
      message: 'Data not updated',
      data: [],
    };
  }

  async addSlide(image, payload: SlideDto, currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const user = currentUser.payload.email;
    if (user == file.email) {
      const data = await this.slideRepo.save({
        ...payload,
        image: image.path,
      });
      return {
        message: 'Success',
        data: data,
      };
    }
  }

  async getSlide() {
    const slide = await this.slideRepo.find();
    if (!slide) {
      throw new HttpException('This slide cant found', 404);
    }
    return {
      data: slide,
    };
  }

  async getSlideByLang(language: string) {
    const slide = await this.slideRepo.findOne({
      where: { language: language },
    });
    if (!slide) {
      throw new HttpException('This slide cant found', 404);
    }
    return {
      data: slide,
    };
  }

  async deleteSlide(id: number, currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const user = currentUser.payload.email;
    if (user == file.email) {
      const slide = await this.slideRepo.findOne({ id });
      if (slide) {
        await this.slideRepo.delete({ id });
        fs.unlink(slide.image, (err) => {
          console.log(err);
        });
        return {
          message: 'Success',
        };
      } else {
        throw new HttpException('Slide not found!!!', 404);
      }
    }
  }

  public async updateSlide(id: number, payload: SlideDto) {
    const slide = await this.slideRepo.findOne(id);
    if (!slide) {
      throw new HttpException('Slide not found!!!', 404);
    }
    const data = await this.slideRepo.update({ id }, payload);
    if (data && data.affected > 0) {
      return {
        message: 'success',
        data: await this.slideRepo.findOne(id),
      };
    }
    return {
      message: 'Data not updated',
      data: [],
    };
  }

  public async updateSlideImage(id: number, image) {
    const slide = await this.slideRepo.findOne(id);
    if (!slide) {
      await fs.unlink(image.path, (err) => {
        console.log(err);
      });
      throw new HttpException('Slide not found!!!', 404);
    }
    const data = await this.slideRepo.update({ id }, { image: image.path });
    if (data && data.affected > 0) {
      await fs.unlink(slide.image, (err) => {
        console.log(err);
      });
      return {
        message: 'success',
        data: await this.slideRepo.findOne(id, image),
      };
    }
    return {
      message: 'Data not updated',
      data: [],
    };
  }

  async createBonus(payload: BonusDto) {
    await this.bonusRepo.save({
      bonus: payload.bonus,
      limit: payload.limit,
    });
    return {
      message: 'success',
    };
  }

  async getOrders(currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const cart = await this.cartRepo.find({
      where: {
        active: false,
      },
    });

    const order = await this.cartItemRepo.find({
      // where: {
      //   cart: [],
      // },
      relations: ['product', 'cart', 'cart.user'],
    });

    return order;

    // if (!order) {
    //   throw new HttpException('Order not found!!!', 404);
    // }
    // return order;
  }

  async getBonus(currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const bonus = await this.bonusRepo.find();
    if (!bonus) {
      throw new HttpException('Bonus doesnt exist!', 404);
    }
    return {
      message: 'Success',
      data: bonus,
    };
  }

  async updateBonus(id: number, payload: BonusDto, currentUser) {
    if (!currentUser.payload) {
      throw new HttpException('You dont have permission for this!', 400);
    }
    const user = currentUser.payload.email;
    if (user == file.email) {
      const bonus = await this.bonusRepo.findOne(id);
      if (!bonus) {
        throw new HttpException('Bonus not found!!!', 404);
      }
      await this.bonusRepo.update({ id }, payload);
    }
    return {
      message: 'Success',
    };
  }
}
