import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MatchModule } from './modules/match/match.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClubModule } from './modules/club/club.module';
import { CartModule } from './modules/cart/cart.module';
import { StaffModule } from './modules/staff/staff.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // để dùng process.env ở mọi nơi
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mssql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAMEDATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'], // Dẫn đến các entity nhưng các enity phải có đuôi .entity
      synchronize: true, // tự động tạo bảng từ entity, chỉ bật khi development
      options: {
        encrypt: true, // bắt buộc phải có nếu SQL Server bật tính năng bảo mật (thường là mặc định)
        trustServerCertificate: true, // Tin cậy chứng chỉ SSL của SQL Server, nếu không bật cái này → kết nối bị lỗi
      },
    }),

    UserModule,
    MatchModule,
    TicketModule,
    AuthModule,
    ClubModule,
    CartModule,
    StaffModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
