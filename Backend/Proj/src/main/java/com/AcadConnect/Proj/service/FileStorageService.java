package com.AcadConnect.Proj.service;

import com.AcadConnect.Proj.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${app.file.upload-dir:./uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create directory where uploaded files will be stored", ex);
        }
    }

    public StorageResult storeFile(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        try {
            if (originalFilename.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + originalFilename);
            }

            String extension = "";
            int extIdx = originalFilename.lastIndexOf('.');
            if (extIdx >= 0) {
                extension = originalFilename.substring(extIdx);
            }

            String storageKey = UUID.randomUUID().toString() + extension;
            Path targetLocation = this.fileStorageLocation.resolve(storageKey);

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return StorageResult.builder()
                    .storageKey(storageKey)
                    .originalFilename(originalFilename)
                    .mimeType(file.getContentType())
                    .sizeBytes(file.getSize())
                    .fileUrl("/api/files/" + storageKey)
                    .build();

        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String storageKey) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storageKey).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("File not found or unreadable: " + storageKey);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageException("File not found: " + storageKey, ex);
        }
    }

    public void deleteFile(String storageKey) {
        try {
            Path filePath = this.fileStorageLocation.resolve(storageKey).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new FileStorageException("Could not delete file: " + storageKey, ex);
        }
    }

    @lombok.Getter
    @lombok.Setter
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    @lombok.Builder
    public static class StorageResult {
        private String storageKey;
        private String originalFilename;
        private String mimeType;
        private Long sizeBytes;
        private String fileUrl;
    }
}

