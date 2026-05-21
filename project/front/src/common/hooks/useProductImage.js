import { useState } from "react";
import {
  uploadImageToCloudinary,
  addProductImage,
  deleteProductImage,
} from "../utils/productImageApi";
import { apiClient } from "../utils/apiClient";

const isLocalUrl = (url) =>
  url.includes("localhost:") || url.includes("mock-uploads");

/**
 * Hook centralisant toutes les opérations sur les images d'un produit :
 *  - upload vers Cloudinary
 *  - sauvegarde de l'URL en base via productImageApi
 *  - suppression (base + Cloudinary)
 */
export const useProductImage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Uploade un fichier vers Cloudinary et retourne son URL.
   * Si productId est fourni, sauvegarde aussi l'URL en base.
   * @param {File} rawFile
   * @param {number} [productId]
   * @returns {Promise<string|null>}
   */
  const uploadImage = async (rawFile, productId) => {
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadImageToCloudinary(rawFile);
      if (productId) {
        await addProductImage(productId, url);
      }
      return url;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Supprime un enregistrement image en base et efface le fichier sur Cloudinary.
   * @param {number} imageId  - ID en base
   * @param {string} imageUrl - URL Cloudinary (pour la suppression distante)
   * @returns {Promise<boolean>}
   */
  const deleteImage = async (imageId, imageUrl) => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteProductImage(imageId);
      if (imageUrl && !isLocalUrl(imageUrl)) {
        await apiClient.delete("/api/common/images", {
          params: { url: imageUrl },
        });
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { uploadImage, deleteImage, isUploading, isDeleting, error };
};
