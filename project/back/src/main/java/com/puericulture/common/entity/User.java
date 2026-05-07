package com.puericulture.common.entity; // 定义用户实体所在的公共实体包。

import jakarta.persistence.Column; // 引入字段映射注解，用来配置数据库列。
import jakarta.persistence.Entity; // 引入实体注解，用来声明这是数据库实体。
import jakarta.persistence.GeneratedValue; // 引入主键生成策略注解。
import jakarta.persistence.GenerationType; // 引入主键生成类型枚举。
import jakarta.persistence.Id; // 引入主键注解。
import jakarta.persistence.OneToMany; // 引入一对多关系注解。
import jakarta.persistence.Table; // 引入表名映射注解。
import java.util.ArrayList; // 引入 ArrayList，用来初始化用户发布列表。
import java.util.List; // 引入 List，用来保存用户发布的所有帖子。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，减少重复代码。
@Setter // 自动为所有字段生成 setter，减少重复代码。
@Entity // 声明该类是 JPA 实体，会映射到数据库表。
@Table(name = "users") // 使用 users 作为表名，避免直接使用数据库保留词 user。
public class User { // 定义 User 类，对应类图里的 User。

    @Id // 标记 id 为主键。
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 使用数据库自增策略生成主键。
    private Long id; // 保存用户唯一编号，对应类图中的 id: long。

    @Column(nullable = false, unique = true) // 设置 email 不为空且唯一。
    private String email; // 保存用户邮箱，对应类图中的 email: String。

    @Column(nullable = false) // 设置 name 不为空。
    private String name; // 保存用户姓氏或名称，对应类图中的 name: String。

    @Column(nullable = false) // 设置 firstname 不为空。
    private String firstname; // 保存用户名字，对应类图中的 firstname: String。

    @Column(nullable = false) // 设置 password 不为空。
    private String password; // 保存用户密码，对应类图中的 password: String。

    @Column(nullable = false) // 设置 city 不为空。
    private String city; // 保存用户城市，对应类图中的 city: string。

    @Column(nullable = false) // 设置 street 不为空。
    private String street; // 保存用户街道，对应类图中的 Street: string。

    @OneToMany(mappedBy = "author") // 声明一个用户可以发布多条 Posts，关系由 Posts.author 维护。
    private List<Posts> posts = new ArrayList<>(); // 保存该用户发布的所有帖子，匹配类图中 User 1 到 Posts *。
} // 结束 User 实体类。
