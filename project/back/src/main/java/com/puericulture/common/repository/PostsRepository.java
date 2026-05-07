package com.puericulture.common.repository; // 定义帖子仓库所在的公共 repository 包。

import com.puericulture.common.entity.Posts; // 引入 Posts 实体，用来操作 posts 表。
import java.util.List; // 引入 List，用来返回多条发布内容。
import org.springframework.data.jpa.repository.JpaRepository; // 引入 JpaRepository，获得基础数据库操作能力。

public interface PostsRepository extends JpaRepository<Posts, Long> { // 定义 PostsRepository，用 Long 作为 Posts 主键类型。

    List<Posts> findAllByOpenTrueOrderByIdDesc(); // 查询所有开放中的帖子，并按 id 倒序展示最新内容。
} // 结束 PostsRepository 接口。
