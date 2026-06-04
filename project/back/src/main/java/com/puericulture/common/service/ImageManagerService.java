package com.puericulture.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Cross-cutting service for media management. Designed to survive missing configuration (Dev / Mock
 * mode).
 */
@Service
@Slf4j
public class ImageManagerService {

    private final Cloudinary cloudinary;

    /**
     * Soft injection: the service does not crash if Cloudinary env vars are absent. In that case it
     * starts in DEGRADED (mock) mode.
     */
    public ImageManagerService(
            @Value("${CLOUDINARY_CLOUD_NAME:}") String cloudName,
            @Value("${CLOUDINARY_API_KEY:}") String apiKey,
            @Value("${CLOUDINARY_API_SECRET:}") String apiSecret) {

        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            log.warn(
                    "⚠️ Cloudinary credentials are missing. ImageManagerService is running in DEGRADED (Mock) mode.");
            this.cloudinary = null;
        } else {
            this.cloudinary =
                    new Cloudinary(
                            ObjectUtils.asMap(
                                    "cloud_name", cloudName,
                                    "api_key", apiKey,
                                    "api_secret", apiSecret,
                                    "secure", true));
            log.info("✅ Cloudinary initialised successfully.");
        }
    }

    /**
     * Deletes an image from Cloudinary by its URL.
     *
     * <p>If the service is running in mock mode, the operation is silently simulated. If the URL
     * points to a local / mock resource, the deletion is also skipped.
     *
     * @param imageUrl the full Cloudinary delivery URL of the image to delete
     * @throws IllegalArgumentException if the URL is null, blank, or has an unrecognised format
     * @throws IllegalStateException if Cloudinary is not configured on this environment
     * @throws RuntimeException if the remote deletion call fails
     */
    public void deleteImageByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Image URL must not be blank.");
        }

        // 1. Skip deletion for local / mock URLs (network guard)
        if (imageUrl.contains("localhost:") || imageUrl.contains("mock-uploads")) {
            log.info("[MOCK] Deletion skipped for local file: {}", imageUrl);
            return;
        }

        // 2. Ensure Cloudinary is configured
        if (this.cloudinary == null) {
            log.error(
                    "Cloudinary deletion attempted on an unconfigured instance. URL: {}", imageUrl);
            throw new IllegalStateException(
                    "Cloudinary service is not active in this environment.");
        }

        // 3. Extract the public_id (folder-aware)
        String publicId = extractPublicIdFromUrl(imageUrl);

        try {
            // 4. Perform the deletion
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Cloudinary response for '{}': {}", publicId, result.get("result"));
        } catch (Exception e) {
            log.error("Critical failure while deleting Cloudinary asset for URL: {}", imageUrl, e);
            throw new RuntimeException("Unable to delete the remote image.");
        }
    }

    /**
     * Extracts the Cloudinary {@code public_id} from a delivery URL.
     *
     * <h3>How Cloudinary public IDs work</h3>
     *
     * <p>A typical Cloudinary URL looks like:
     *
     * <pre>
     *   https://res.cloudinary.com/{cloud}/image/upload/v1234567890/{folder}/{subfolder}/{filename}.webp
     * </pre>
     *
     * <p>The {@code public_id} is everything after {@code /upload/} (and its optional version
     * segment {@code /vXXXXXXXXXX}), <strong>excluding</strong> the file extension. For the example
     * above the public_id is {@code folder/subfolder/filename}.
     *
     * @param url the full Cloudinary delivery URL
     * @return the public_id, including any folder path (e.g. {@code users/avatars/img})
     * @throws IllegalArgumentException if the URL does not contain the expected {@code /upload/}
     *     marker
     */
    private String extractPublicIdFromUrl(String url) {
        final String UPLOAD_MARKER = "/upload/";

        int uploadIndex = url.indexOf(UPLOAD_MARKER);
        if (uploadIndex == -1) {
            log.error(
                    "Cannot extract public_id — URL does not contain '{}': {}", UPLOAD_MARKER, url);
            throw new IllegalArgumentException("Unrecognised Cloudinary URL format: " + url);
        }

        // Everything after "/upload/"
        String afterUpload = url.substring(uploadIndex + UPLOAD_MARKER.length());

        // Strip the optional version segment (e.g. "v1234567890/")
        // Cloudinary version tokens match: v followed by digits at the very start of the path.
        afterUpload = afterUpload.replaceFirst("^v\\d+/", "");

        // Strip the file extension
        int lastDotIndex = afterUpload.lastIndexOf('.');
        if (lastDotIndex != -1) {
            afterUpload = afterUpload.substring(0, lastDotIndex);
        }

        if (afterUpload.isBlank()) {
            throw new IllegalArgumentException("Could not determine public_id from URL: " + url);
        }

        return afterUpload; // e.g. "users/avatars/my-image"
    }
}
