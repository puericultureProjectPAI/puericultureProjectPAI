package com.puericulture.common.configuration; // 定义通用配置类所在的 common configuration 包。

import org.springframework.context.annotation.Bean; // 引入 Bean 注解，用来注册配置对象。
import org.springframework.context.annotation.Configuration; // 引入 Configuration 注解，用来声明配置类。
import org.springframework.web.servlet.config.annotation.CorsRegistry; // 引入 CORS 注册器，用来添加跨域规则。
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; // 引入 WebMvcConfigurer，用来扩展 Spring MVC 配置。

@Configuration // 声明该类是 Spring 配置类。
public class CorsConfiguration { // 定义 CORS 配置类，方便前端 Vite 调用后端 API。

    @Bean // 把 WebMvcConfigurer 注册到 Spring 容器中。
    public WebMvcConfigurer corsConfigurer() { // 定义跨域配置 Bean。
        return new WebMvcConfigurer() { // 返回匿名 WebMvcConfigurer 实现。
            @Override // 覆盖 addCorsMappings 方法。
            public void addCorsMappings(CorsRegistry registry) { // 配置允许跨域访问的路径和来源。
                registry.addMapping("/**") // 允许所有后端路径支持跨域。
                        .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173") // 允许 Vite 本地前端访问。
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // 允许常用 HTTP 方法。
                        .allowedHeaders("*"); // 允许前端发送任意请求头。
            } // 结束 addCorsMappings 方法。
        }; // 结束匿名 WebMvcConfigurer 创建。
    } // 结束 corsConfigurer 方法。
} // 结束 CorsConfiguration 类。
