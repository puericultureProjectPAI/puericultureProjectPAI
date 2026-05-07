package com.puericulture.troc.repository; // 定义交换仓库所在的 troc repository 包。

import com.puericulture.troc.entity.Troc; // 引入 Troc 实体，用来操作 troc 表。
import org.springframework.data.jpa.repository.JpaRepository; // 引入 JpaRepository，获得基础数据库操作能力。

public interface TrocRepository extends JpaRepository<Troc, Long> { // 定义 TrocRepository，用 Long 作为 Troc 主键类型。
} // 结束 TrocRepository 接口。
