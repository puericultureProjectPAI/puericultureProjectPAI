package com.puericulture.troc.controller; // 定义交换公告控制器所在的 troc controller 包。

import com.puericulture.troc.dto.CreateTrocPostRequest; // 引入创建请求 DTO，用来接收前端表单数据。
import com.puericulture.troc.dto.TrocPostResponse; // 引入响应 DTO，用来返回公告数据。
import com.puericulture.troc.service.TrocPostService; // 引入业务服务，用来处理发布和查询逻辑。
import jakarta.validation.Valid; // 引入校验注解，用来触发 DTO 字段校验。
import java.util.List; // 引入 List，用来返回公告列表。
import org.springframework.http.HttpStatus; // 引入 HTTP 状态码，用来设置创建成功状态。
import org.springframework.web.bind.annotation.GetMapping; // 引入 GET 映射注解。
import org.springframework.web.bind.annotation.PostMapping; // 引入 POST 映射注解。
import org.springframework.web.bind.annotation.RequestBody; // 引入请求体注解，用来读取 JSON 表单。
import org.springframework.web.bind.annotation.RequestMapping; // 引入路由前缀注解。
import org.springframework.web.bind.annotation.ResponseStatus; // 引入响应状态注解。
import org.springframework.web.bind.annotation.RestController; // 引入 REST 控制器注解。

@RestController // 声明该类是 REST API 控制器。
@RequestMapping("/troc/posts") // 按技术标准使用 /{domain}/{resource}，这里 domain 是 troc，resource 是 posts。
public class TrocPostController { // 定义 TrocPostController，暴露 US1 所需接口。

    private final TrocPostService trocPostService; // 保存业务服务依赖。

    public TrocPostController(TrocPostService trocPostService) { // 通过构造函数注入业务服务。
        this.trocPostService = trocPostService; // 保存 trocPostService 到当前控制器。
    } // 结束构造函数。

    @PostMapping // 声明 POST /troc/posts 接口，用来发布交换公告。
    @ResponseStatus(HttpStatus.CREATED) // 创建成功时返回 201 Created。
    public TrocPostResponse createTrocPost(@Valid @RequestBody CreateTrocPostRequest request) { // 接收并校验前端提交的公告表单。
        return trocPostService.createTrocPost(request); // 调用业务服务创建公告并返回创建结果。
    } // 结束 createTrocPost 接口方法。

    @GetMapping // 声明 GET /troc/posts 接口，用来查看交换公告列表。
    public List<TrocPostResponse> findOpenTrocPosts() { // 定义查询开放公告列表的方法。
        return trocPostService.findOpenTrocPosts(); // 调用业务服务查询列表并返回给前端。
    } // 结束 findOpenTrocPosts 接口方法。
} // 结束 TrocPostController 类。
