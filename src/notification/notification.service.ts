import * as admin from 'firebase-admin';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  MultipleDeviceNotificationDto,
  NotificationDto,
  TopicNotificationDto,
} from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Status } from 'src/common/enums/status.enum';
import { CustomException } from 'src/common/exceptions/custom-exception';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async sendNotification({
    token,
    title,
    body,
    icon,
    userId,
  }: NotificationDto) {
    try {
      const response = await admin.messaging().send({
        token,
        webpush: {
          notification: {
            title,
            body,
            icon,
          },
        },
      });

      const notification = this.notificationRepository.create({
        status: Status.SENT,
        title,
        body,
        read: false,
        user: { id: userId },
      });
      await this.notificationRepository.save(notification);

      return response;
    } catch (error) {
      console.log('Error sending messages:', error);
      return { success: false, message: 'Failed to send notifications' };
    }
  }

  async sendNotificationToMultipleTokens({
    tokens,
    title,
    body,
    icon,
    userId,
  }: MultipleDeviceNotificationDto) {
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        icon: icon || '',
      },
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      const notification = this.notificationRepository.create({
        status: Status.SENT,
        title,
        body,
        read: false,
        user: { id: userId },
      });
      await this.notificationRepository.save(notification);
      return response;
    } catch (error) {
      console.log('Error sending messages:', error);
      return { success: false, message: 'Failed to send notifications' };
    }
  }

  async sendTopicNotification({
    topic,
    title,
    body,
    icon,
  }: TopicNotificationDto) {
    const message = {
      notification: {
        title,
        body,
        icon,
      },
      topic,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, message: 'Topic notification sent successfully' };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false, message: 'Failed to send topic notification' };
    }
  }

  async getAllNotifications(query: PaginateQuery, userId: number) {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.user.id = :userId', { userId })
      .orderBy('notification.updatedAt', 'DESC');

    return paginate(query, queryBuilder, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['user.name', 'title'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
        read: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async readNotification(notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new CustomException('Notification not found', HttpStatus.NOT_FOUND);
    }

    notification.read = true;
    await this.notificationRepository.save(notification);
    return notification;
  }

  async readAllNotifications(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: { user: { id: userId }, read: false },
    });

    for (const notification of notifications) {
      notification.read = true;
    }
    await this.notificationRepository.save(notifications);
    return notifications;
  }
}
