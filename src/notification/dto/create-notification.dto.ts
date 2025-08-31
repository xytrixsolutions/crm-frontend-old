import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({
    type: String,
    description: 'Client device token',
  })
  token: string;

  @ApiProperty({
    type: String,
    description: 'Notification Title',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Notification Body',
  })
  body: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Notification Icon / Logo',
  })
  icon: string;

  @ApiProperty({
    type: Number,
    description: 'User ID to whom the notification is sent',
  })
  userId: number;
}

export class MultipleDeviceNotificationDto extends PickType(NotificationDto, [
  'title',
  'body',
  'icon',
  'userId',
]) {
  @ApiProperty({
    type: String,
    description: 'Clients device token',
  })
  tokens: string[];
}

export class TopicNotificationDto extends PickType(NotificationDto, [
  'title',
  'body',
  'icon',
  'userId',
]) {
  @ApiProperty({
    type: String,
    description: 'Subscription topic to send to',
  })
  topic: string;
}
