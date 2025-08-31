import { Controller, Post, Body, Get, Req, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  MultipleDeviceNotificationDto,
  TopicNotificationDto,
} from './dto/create-notification.dto';
import { Public } from 'src/common/annotations/public.decorator';
import { SuccessMessage } from 'src/common/annotations/success-message.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { Request } from 'express';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Public()
  @Post('send-notification')
  async sendNotification(
    @Body()
    body: {
      token: string;
      title: string;
      body: string;
      icon: string;
      userId: number;
    },
  ) {
    return this.notificationService.sendNotification({
      token: body.token,
      title: body.title,
      body: body.body,
      icon: body.icon,
      userId: body.userId,
    });
  }

  @Post('send-multiple-notifications')
  async sendMultipleNotifications(@Body() body: MultipleDeviceNotificationDto) {
    return this.notificationService.sendNotificationToMultipleTokens({
      tokens: body.tokens,
      title: body.title,
      body: body.body,
      icon: body.icon,
      userId: body.userId,
    });
  }

  @Post('send-topic-notification')
  async sendTopicNotification(@Body() body: TopicNotificationDto) {
    return this.notificationService.sendTopicNotification({
      topic: body.topic,
      title: body.title,
      body: body.body,
      icon: body.icon,
      userId: body.userId,
    });
  }

  @SuccessMessage('Notifications fetched successfully')
  @Get()
  async findAll(@Paginate() query: PaginateQuery, @Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    return this.notificationService.getAllNotifications(query, user.sub);
  }

  @SuccessMessage('Notification read successfully')
  @Get('/read/:id')
  async readNotification(@Param('id') id: string) {
    return this.notificationService.readNotification(+id);
  }

  @SuccessMessage('Notifications read successfully')
  @Get('/read')
  async readAllNotifications(@Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    return this.notificationService.readAllNotifications(user.sub);
  }
}
