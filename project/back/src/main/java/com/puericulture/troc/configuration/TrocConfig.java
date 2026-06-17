package com.puericulture.troc.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class TrocConfig {

    @Bean(name = "trocRestTemplate")
    public RestTemplate trocRestTemplate() {
        return new RestTemplate();
    }
}
