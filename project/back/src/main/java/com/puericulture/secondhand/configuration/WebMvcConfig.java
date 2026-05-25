package com.puericulture.secondhand.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.util.pattern.PathPatternParser;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // ✅ Force les patterns de path modernes pour le module secondhand
        // Cela résout le problème où /api/v1/products était traité comme une ressource
        // statique
        configurer.setPatternParser(new PathPatternParser());
    }
}
