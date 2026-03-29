import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationQueryDto } from './shared/pagination-query.dto';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    CustomersModule,
    OrdersModule,
    PaginationQueryDto,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. ตั้งค่า TypeORM แบบ Async
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'oracle',
        // ลบ host, port, serviceName ด้านบนออกให้หมดถ้าจะใช้ connectString เต็มรูปแบบ
        // หรือใส่ไว้แค่ username/password ก็พอครับ
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),

        // ✅ ปรับตรง CONNECT_DATA ให้เป็น SERVICE_NAME=XEPDB1
        connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${configService.get('DB_HOST')})(PORT=${configService.get('DB_PORT')}))(CONNECT_DATA=(SERVICE_NAME=XEPDB1)))`,

        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
