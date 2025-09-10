import sharp from 'sharp';
import { objectStorageClient } from './objectStorage';
import path from 'path';
import fs from 'fs';

export class ImageProcessor {
  private static readonly STANDARD_WIDTH = 800;
  private static readonly STANDARD_HEIGHT = 600;
  private static readonly WATERMARK_SIZE = 120;
  private static readonly WATERMARK_MARGIN = 20;

  /**
   * Processes a vehicle image by resizing it to standard dimensions and adding a watermark
   */
  async processVehicleImage(inputBuffer: Buffer): Promise<Buffer> {
    try {
      // Load the Castle Motors logo
      const logoPath = path.join(process.cwd(), 'client/public/castle-motors-logo.png');
      
      if (!fs.existsSync(logoPath)) {
        console.warn('Castle Motors logo not found, processing without watermark');
        return await this.resizeImage(inputBuffer);
      }

      // Resize the main image to standard dimensions
      const resizedImage = await sharp(inputBuffer)
        .resize(ImageProcessor.STANDARD_WIDTH, ImageProcessor.STANDARD_HEIGHT, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Prepare the watermark
      const watermark = await sharp(logoPath)
        .resize(ImageProcessor.WATERMARK_SIZE, undefined, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ quality: 90 })
        .toBuffer();

      // Get watermark dimensions for positioning
      const { width: wmWidth, height: wmHeight } = await sharp(watermark).metadata();
      
      // Composite the watermark onto the image (bottom-right)
      const processedImage = await sharp(resizedImage)
        .composite([{
          input: watermark,
          top: ImageProcessor.STANDARD_HEIGHT - (wmHeight || ImageProcessor.WATERMARK_SIZE) - ImageProcessor.WATERMARK_MARGIN,
          left: ImageProcessor.STANDARD_WIDTH - (wmWidth || ImageProcessor.WATERMARK_SIZE) - ImageProcessor.WATERMARK_MARGIN,
          blend: 'over'
        }])
        .jpeg({ quality: 85 })
        .toBuffer();

      return processedImage;
    } catch (error) {
      console.error('Error processing image with watermark:', error);
      // Fallback to just resizing if watermarking fails
      return await this.resizeImage(inputBuffer);
    }
  }

  /**
   * Resizes an image to standard dimensions without watermark
   */
  private async resizeImage(inputBuffer: Buffer): Promise<Buffer> {
    return sharp(inputBuffer)
      .resize(ImageProcessor.STANDARD_WIDTH, ImageProcessor.STANDARD_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  }

  /**
   * Downloads an image from object storage, processes it, and uploads the processed version
   */
  async processAndReplaceImage(bucketName: string, objectName: string): Promise<void> {
    try {
      // Download the original image
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      
      const [buffer] = await file.download();
      
      // Process the image
      const processedBuffer = await this.processVehicleImage(buffer);
      
      // Upload the processed image back to the same location
      await file.save(processedBuffer, {
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            processedByServer: 'true',
            processedAt: new Date().toISOString()
          }
        }
      });

      console.log(`Successfully processed and replaced image: ${objectName}`);
    } catch (error) {
      console.error(`Error processing image ${objectName}:`, error);
      throw error;
    }
  }
}

export const imageProcessor = new ImageProcessor();