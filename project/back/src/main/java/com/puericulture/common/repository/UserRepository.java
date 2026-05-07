package com.puericulture.common.repository; // 定义用户仓库所在的公共 repository 包。

import com.puericulture.common.entity.User; // 引入 User 实体，用来操作 users 表。
import java.util.Optional; // 引入 Optional，用来安全处理可能不存在的数据。
import org.springframework.data.jpa.repository.JpaRepository; // 引入 JpaRepository，获得基础数据库操作能力。

public interface UserRepository extends JpaRepository<User, Long> { // 定义 UserRepository，用 Long 作为 User 主键类型。

    Optional<User> findByEmail(String email); // 根据邮箱查询用户，用于创建默认测试作者前先避免重复。
} // 结束 UserRepository 接口。
