import { useImageManager } from "./useImageManager";
import { addProductImage, deleteProductImage } from "../utils/productImageApi";
import { apiClient } from "../utils/apiClient";

const isLocalUrl = (url) =>
  url.includes("localhost:") || url.includes("mock-uploads");

/**
 * Hook centralisant toutes les opérations sur les images d'un produit :
 *  - upload vers Cloudinary (via useImageManager)
 *  - sauvegarde de l'URL en base via productImageApi
 *  - suppression (base + Cloudinary)
 */
export const useProductImage = () => {
  const {
    uploadImage: uploadToCloudinary,
    isUploading,
    isDeleting,
    error,
  } = useImageManager();

  /**
   * Uploade un fichier vers Cloudinary et retourne son URL.
   * Si productId est fourni, sauvegarde aussi l'URL en base.
   * @param {File} rawFile
   * @param {number} [productId]
   * @returns {Promise<string|null>}
   */
  const uploadImage = async (rawFile, productId) => {
    const url = await uploadToCloudinary(rawFile);
    if (url && productId) {
      await addProductImage(productId, url);
    }
    return url;
  };

  /**
   * Supprime un enregistrement image en base et efface le fichier sur Cloudinary.
   * @param {number} imageId  - ID en base
   * @param {string} imageUrl - URL Cloudinary (pour la suppression distante)
   * @returns {Promise<boolean>}
   */
  const deleteImage = async (imageId, imageUrl) => {
    try {
      await deleteProductImage(imageId);
      if (imageUrl && !isLocalUrl(imageUrl)) {
        await apiClient.delete("/api/common/images", {
          params: { url: imageUrl },
        });
      }
      return true;
    } catch {
      return false;
    }
  };

  return { uploadImage, deleteImage, isUploading, isDeleting, error };
};
