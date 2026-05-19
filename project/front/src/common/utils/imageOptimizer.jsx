import imageCompression from "browser-image-compression";

/**
 * Destroys the original image and reconstructs it according to strict standards.
 */
export const optimizeImage = async (file) => {
  const options = {
    maxSizeMB: 0.15, // Force a maximum of 150 KB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: "image/webp", // Forced Conversion to WebP
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Échec de l'optimisation :", error);
    throw error;
  }
};
