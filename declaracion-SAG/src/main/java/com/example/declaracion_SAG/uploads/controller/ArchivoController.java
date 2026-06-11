package com.example.declaracion_SAG.uploads.controller;

import com.example.declaracion_SAG.uploads.services.ArchivoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/v1/archivos")
@Slf4j
public class ArchivoController {

    @Autowired
    private ArchivoService archivoService;

    @PostMapping("/upload/{declaracionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI','SAG','TURISTA')")
    public ResponseEntity<String> subirArchivo(
            @PathVariable Long declaracionId,
            @RequestParam("archivo") MultipartFile archivo){

        log.info("Solicitud POST upload archivo para declaración {}",
                declaracionId);

        String nombreArchivo =
                archivoService.almacenarArchivo(
                        declaracionId,
                        archivo);

        log.info("Archivo {} subido correctamente",
                nombreArchivo);

        return ResponseEntity.ok(
                "Archivo subido correctamente: "
                        + nombreArchivo);
    }

    @GetMapping("/download/{nombreArchivo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PDI','SAG')")
    public ResponseEntity<Resource> descargarArchivo(
            @PathVariable String nombreArchivo){

        log.info("Solicitud GET download archivo {}",
                nombreArchivo);

        Resource resource =
                archivoService.cargarArchivoComoRecurso(
                        nombreArchivo);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + resource.getFilename()
                                + "\"")
                .body(resource);
    }
}


