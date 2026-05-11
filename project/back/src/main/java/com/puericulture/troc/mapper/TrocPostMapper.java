package com.puericulture.troc.mapper; // 定义交换公告 mapper 所在的 troc mapper 包。

import com.puericulture.troc.dto.TrocPostResponse; // 引入响应 DTO，用来返回给前端。
import com.puericulture.troc.entity.Troc; // 引入 Troc 实体，用来读取交换公告及其继承字段。

public class TrocPostMapper { // 定义 TrocPostMapper，负责把实体转换成 DTO。

    private TrocPostMapper() { // 定义私有构造函数，避免工具类被实例化。
    } // 结束私有构造函数。

    public static TrocPostResponse toResponse(Troc troc) { // 定义 Troc 实体转响应 DTO 的静态方法。
        return new TrocPostResponse( // 创建响应 DTO，并把数据库字段整理成前端需要的结构。
                troc.getId(), // 填充公告 id；在继承模型中该 id 来自 Posts。
                troc.getId(), // 填充 Troc 类型记录 id；根据 JOINED 继承策略它与 Posts.id 相同。
                troc.getTitle(), // 填充公告标题；该字段继承自 Posts。
                troc.getDescription(), // 填充公告描述；该字段继承自 Posts。
                troc.getImagesReferences(), // 填充图片引用；该字段继承自 Posts。
                troc.isOpen(), // 填充公告开放状态；该字段继承自 Posts。
                troc.getEstimatedPrice(), // 填充交换估计价值；该字段属于 Troc。
                troc.getAuthor().getId(), // 填充作者 id；author 字段继承自 Posts。
                troc.getAuthor().getFirstname() + " " + troc.getAuthor().getName() // 拼接作者姓名用于前端展示。
        ); // 结束响应 DTO 创建。
    } // 结束 toResponse 方法。
} // 结束 TrocPostMapper 类。
