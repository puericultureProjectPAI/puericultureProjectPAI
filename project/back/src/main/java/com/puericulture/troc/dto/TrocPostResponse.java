package com.puericulture.troc.dto; // 定义交换公告响应 DTO 所在的 troc dto 包。

import lombok.AllArgsConstructor; // 引入全参构造注解，方便 mapper 一次性创建响应对象。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。

@Getter // 自动为所有字段生成 getter，方便 Spring 转成 JSON 响应。
@AllArgsConstructor // 自动生成全参构造函数，方便手动 mapper 使用。
public class TrocPostResponse { // 定义返回给前端的 Troc 公告响应对象。

    private Long postId; // 返回 Posts 的 id，用来识别公告本身。

    private Long trocId; // 返回 Troc 的 id，用来识别交换类型记录。

    private String title; // 返回公告标题。

    private String description; // 返回公告描述。

    private String imagesReferences; // 返回图片引用。

    private boolean open; // 返回公告是否仍然开放。

    private Long estimatedPrice; // 返回交换物品估计价值。

    private Long authorId; // 返回作者编号。

    private String authorName; // 返回作者显示名称。
} // 结束 TrocPostResponse 类。
