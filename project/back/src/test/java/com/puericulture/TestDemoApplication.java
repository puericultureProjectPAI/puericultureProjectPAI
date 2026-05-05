package com.puericulture;

import org.springframework.boot.SpringApplication;

public class TestDemoApplication {

	public static void main(String[] args) {
		SpringApplication.from(App::main).with(TestcontainersConfiguration.class).run(args);
	}

}
