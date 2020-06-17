import ReactCrop from 'react-image-crop';

const DEFAULT_IMAGE_ASPECT_RATIO = 3 / 2;

const generateImageBlobFromCrop = (
  image: HTMLImageElement,
  crop: ReactCrop.Crop
): Promise<Blob | null> | undefined => {
  let cropAspectRatio = DEFAULT_IMAGE_ASPECT_RATIO;
  if (crop.width && crop.height) {
    cropAspectRatio = crop.width / crop.height;
  }

  const OUTPUT_IMAGE_WIDTH = 240;
  const OUTPUT_IMAGE_HEIGHT = Math.round(OUTPUT_IMAGE_WIDTH / cropAspectRatio);

  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = OUTPUT_IMAGE_WIDTH;
  canvas.height = OUTPUT_IMAGE_HEIGHT;

  const context = canvas.getContext('2d');
  if (context) {
    context.drawImage(
      image,
      (crop.x ?? 0) * scaleX,
      (crop.y ?? 0) * scaleY,
      (crop.width ?? 80) * scaleX,
      (crop.height ?? 45) * scaleY,
      0,
      0,
      OUTPUT_IMAGE_WIDTH,
      OUTPUT_IMAGE_HEIGHT
    );
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      'image/jpeg',
      1
    );
  });
};

export default {
  DEFAULT_IMAGE_ASPECT_RATIO,
  generateImageBlobFromCrop,
};
