import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ModelsModule } from './models/models.module';
import { ChatModule } from './chat/chat.module';
import { UploadModule } from './upload/upload.module';
import { FormsModule } from './forms/forms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const dnsServers = cfg.get<string>('MONGODB_DNS_SERVERS', '');
        const dnsOptions = dnsServers ? {
          servers: dnsServers.split(',').map(s => s.trim())
        } : {};

        return {
          uri: cfg.get<string>('MONGODB_URI', 'mongodb://localhost:27017/nexusai'),
          dbName: cfg.get<string>('MONGODB_DB_NAME'),
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('✅ MongoDB connected successfully');
            });
            connection.on('error', (err: Error) => {
              console.error('❌ MongoDB connection error:', err);
            });
            return connection;
          },
          ...dnsOptions,
        };
      },
    }),
    AuthModule,
    UsersModule,
    ModelsModule,
    ChatModule,
    UploadModule,
    FormsModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
