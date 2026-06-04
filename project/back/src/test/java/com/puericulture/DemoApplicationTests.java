package com.puericulture;

import com.puericulture.common.mapper.PersonMapper;
import com.puericulture.forwardtrading.mapper.ChildrenMapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class DemoApplicationTests {

    @MockBean private ChildrenMapper childrenMapper;

    @MockBean private PersonMapper personMapper;

    @Test
    void contextLoads() {}
}
