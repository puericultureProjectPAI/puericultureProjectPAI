package com.puericulture; // 定义 Spring Boot 主应用所在的根包。

import org.springframework.boot.SpringApplication; // 引入 SpringApplication，用来启动 Spring Boot 应用。
import org.springframework.boot.autoconfigure.SpringBootApplication; // 引入 SpringBootApplication，用来启用自动配置和组件扫描。
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration; // 引入安全自动配置类，用来临时排除默认登录页。

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class }) // 声明主启动类，并暂时关闭默认安全配置，方便当前 Sprint 联调接口。
public class App { // 定义应用启动类。
    public static void main(String[] args) { // 定义 Java 程序入口方法。
        SpringApplication.run(App.class, args); // 启动 Spring Boot 应用。
    } // 结束 main 方法。
} // 结束 App 类。
