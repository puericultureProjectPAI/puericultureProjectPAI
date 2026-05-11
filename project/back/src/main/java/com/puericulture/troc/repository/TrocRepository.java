package com.puericulture.troc.repository; // 定义交换仓库所在的 troc repository 包。

import com.puericulture.troc.entity.Troc; // 引入 Troc 实体，用来操作 troc 子表和继承自 posts 的公共字段。
import java.util.List; // 引入 List，用来返回多条交换公告。
import org.springframework.data.jpa.repository.JpaRepository; // 引入 JpaRepository，获得基础数据库操作能力。

public interface TrocRepository extends JpaRepository<Troc, Long> { // 定义 TrocRepository，用 Long 作为 Troc/Posts 共享主键类型。

    List<Troc> findAllByOpenTrueOrderByIdDesc(); // 查询所有开放中的 Troc 公告，并按继承自 Posts 的 id 倒序返回。
} // 结束 TrocRepository 接口。
