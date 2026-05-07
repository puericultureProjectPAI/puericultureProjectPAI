package com.puericulture.troc.mapper; // 定义交换公告 mapper 所在的 troc mapper 包。

import com.puericulture.common.entity.Posts; // 引入 Posts 实体，用来读取公告基础信息。
import com.puericulture.troc.dto.TrocPostResponse; // 引入响应 DTO，用来返回给前端。
import com.puericulture.troc.entity.Troc; // 引入 Troc 实体，用来读取交换类型信息。

public class TrocPostMapper { // 定义 TrocPostMapper，负责把实体转换成 DTO。

    private TrocPostMapper() { // 定义私有构造函数，避免工具类被实例化。
    } // 结束私有构造函数。

    public static TrocPostResponse toResponse(Posts post, Troc troc) { // 定义实体转响应 DTO 的静态方法。
        return new TrocPostResponse( // 创建响应 DTO，并把数据库字段整理成前端需要的结构。
                post.getId(), // 填充公告 id。
                troc.getId(), // 填充 Troc 类型记录 id。
                post.getTitle(), // 填充公告标题。
                post.getDescription(), // 填充公告描述。
                post.getImagesReferences(), // 填充图片引用。
                post.isOpen(), // 填充公告开放状态。
                troc.getEstimatedPrice(), // 填充交换估计价值。
                post.getAuthor().getId(), // 填充作者 id。
                post.getAuthor().getFirstname() + " " + post.getAuthor().getName() // 拼接作者姓名用于前端展示。
        ); // 结束响应 DTO 创建。
    } // 结束 toResponse 方法。
} // 结束 TrocPostMapper 类。
