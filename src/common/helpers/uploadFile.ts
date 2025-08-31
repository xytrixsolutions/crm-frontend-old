import { S3 } from 'aws-sdk';

export class S3Uploader {
  private s3: S3;

  constructor(private configService: { get: (key: string) => string }) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  async upload(
    buffer: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<S3.ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: bucket,
      Key: name,
      Body: buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      return await this.s3.upload(params).promise();
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw error;
    }
  }
}
