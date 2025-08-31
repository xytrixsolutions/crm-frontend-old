/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailDto } from './dto/create-email.dto';
import * as path from 'path';
import * as ejs from 'ejs';
import { Email } from './entities/email.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../common/enums/status.enum';
import { UserService } from '../user/user.service';
import { CustomException } from '../common/exceptions/custom-exception';
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { EmailType } from '../common/enums/email-type.enum';
import { LeadsService } from '../leads/leads.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly contentEnum = {
    [EmailType.INVOICE]: {
      template: 'invoice',
      subject: 'Invoice from Your Company',
    },
    [EmailType.QUOTATION]: {
      template: 'quotation',
      subject: 'Quotation from Your Company',
    },
  };

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly leadService: LeadsService,
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {}

  async sendMail(mailReq: CreateEmailDto, userId: number, preview?: boolean) {
    const contentType = this.contentEnum[mailReq.type];

    if (!contentType) {
      this.logger.error(`Invalid email content type: ${mailReq.type}`);
      return;
    }

    const templatePath = path.join(
      process.cwd(),
      'src/templates',
      `${contentType.template}.ejs`,
    );

    // Load content
    const contentHtml = await ejs.renderFile(templatePath, mailReq);

    // Load template
    const html = await ejs.renderFile(
      path.join(process.cwd(), 'src/templates/layout.ejs'),
      {
        ...mailReq,
        content: contentHtml,
        include: (filename: string) => {
          return path.join(process.cwd(), 'src/templates', filename);
        },
      },
    );

    if (preview) {
      return html;
    }

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new CustomException('User not found', HttpStatus.NOT_FOUND);
    }

    const data = {
      status: Status.SENT,
      modelId: mailReq.modelId,
      modelType: mailReq.modelType,
      email: mailReq.email,
      subject: mailReq.subject || contentType.subject,
      body: html,
      context: mailReq.context,
      type: mailReq.type,
      sentAt: Date.now(),
      user: user,
    };

    try {
      await this.mailerService.sendMail({
        to: mailReq.email,
        from: this.configService.get<string>('SMTP_FROM_MAIL'),
        subject: mailReq.subject || contentType.subject,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${mailReq.email}: ${error.message}`,
      );
      data.status = Status.FAILED;
    }

    const emailEntity = this.emailRepository.create({
      ...data,
    });
    await this.emailRepository.save(emailEntity);

    if (
      mailReq.type === EmailType.QUOTATION ||
      mailReq.type === EmailType.INVOICE
    ) {
      await this.leadService.updateLeadAction(mailReq.leadId!, {
        status: mailReq.type,
      });
    }

    this.logger.log(`Email sent successfully to ${mailReq.email}`);
  }

  async findAll(
    query: PaginateQuery,
    userId?: number,
  ): Promise<Paginated<Email>> {
    const queryBuilder = this.emailRepository.createQueryBuilder('email');
    if (userId) {
      queryBuilder.where('email.user.id = :userId', { userId });
    }
    return paginate(query, queryBuilder, {
      nullSort: 'last',
      defaultSortBy: [['updatedAt', 'DESC']],
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      searchableColumns: ['subject', 'email'],
      filterableColumns: {
        status: [FilterOperator.EQ, FilterSuffix.NOT],
        type: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  async findByModelTypeAndId(type: string, id: number) {
    return await this.emailRepository.findOne({
      where: { modelType: type, modelId: id },
    });
  }
}
