import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TricycleModule } from './tricycle/tricycle.module';
import { OrderModule } from './order/order.module';
import { InvestmentModule } from './investment/investment.module';
import { PaymentModule } from './payment/payment.module';
import { PayoutModule } from './payout/payout.module';
import { PayoutscheduleModule } from './payoutschedule/payoutschedule.module';
import { RepaymentscheduleModule } from './repaymentschedule/repaymentschedule.module';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    UserModule,
    AuthModule,
    TricycleModule,
    OrderModule,
    InvestmentModule,
    PaymentModule,
    PayoutModule,
    PayoutscheduleModule,
    RepaymentscheduleModule,
    DashboardModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
