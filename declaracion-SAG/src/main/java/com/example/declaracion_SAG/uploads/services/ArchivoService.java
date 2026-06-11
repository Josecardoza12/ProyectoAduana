package com.example.declaracion_SAG.uploads.services;
import com.example.declaracion_SAG.exception.DeclaracionSagNotFoundException;
import com.example.declaracion_SAG.model.DeclaracionSag;
import com.example.declaracion_SAG.repository.DeclaracionSagRepository;
import com.example.declaracion_SAG.uploads.config.FileStorageConfig;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;


@Service
@Slf4j
public class ArchivoService {

    @Autowired
    private FileStorageConfig fileStorageConfig;

    @Autowired
    private DeclaracionSagRepository declaracionSagRepository;

    private Path fileStorageLocation;

    @PostConstruct
    public void init(){

        this.fileStorageLocation = Paths.get(
                        fileStorageConfig.getUploadDir())
                .toAbsolutePath()
                .normalize();

        try{

            Files.createDirectories(this.fileStorageLocation);

            log.info("Directorio de archivos inicializado en {}",
                    this.fileStorageLocation);

        }catch (Exception e){

            throw new RuntimeException(
                    "No se pudo crear el directorio de uploads");
        }
    }

    public String almacenarArchivo(
            Long declaracionId,
            MultipartFile archivo){

        DeclaracionSag declaracion =
                declaracionSagRepository.findById(declaracionId)
                        .orElseThrow(() ->
                                new DeclaracionSagNotFoundException(
                                        declaracionId));

        String nombreArchivo = StringUtils.cleanPath(
                Objects.requireNonNull(
                        archivo.getOriginalFilename()));

        try{

            Path destino =
                    this.fileStorageLocation.resolve(nombreArchivo);

            Files.copy(
                    archivo.getInputStream(),
                    destino,
                    StandardCopyOption.REPLACE_EXISTING);

            declaracion.setArchivoAdjunto(nombreArchivo);

            declaracionSagRepository.save(declaracion);

            log.info("Archivo {} almacenado correctamente",
                    nombreArchivo);

            return nombreArchivo;

        }catch (IOException e){

            throw new RuntimeException(
                    "No se pudo almacenar el archivo "
                            + nombreArchivo);
        }
    }

    public Resource cargarArchivoComoRecurso(
            String nombreArchivo){

        try{

            Path archivoPath =
                    this.fileStorageLocation
                            .resolve(nombreArchivo)
                            .normalize();

            Resource recurso =
                    new UrlResource(archivoPath.toUri());

            if(recurso.exists()){

                return recurso;
            }

            throw new RuntimeException(
                    "Archivo no encontrado");

        }catch (Exception e){

            throw new RuntimeException(
                    "Error al cargar archivo");
        }
    }
}

