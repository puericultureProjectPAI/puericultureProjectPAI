package com.puericulture.troc.entity; // 定义交换类型实体所在的 troc 实体包。

import com.puericulture.common.entity.Posts; // 引入 Posts 实体，用来关联一条发布内容。
import jakarta.persistence.Column; // 引入字段映射注解，用来配置数据库列。
import jakarta.persistence.Entity; // 引入实体注解，用来声明这是数据库实体。
import jakarta.persistence.FetchType; // 引入加载策略枚举，用来配置关联加载方式。
import jakarta.persistence.Id; // 引入主键注解。
import jakarta.persistence.JoinColumn; // 引入外键列注解，用来配置共享主键外键。
import jakarta.persistence.MapsId; // 引入共享主键注解，用来让 Troc.id 等于 Posts.id。
import jakarta.persistence.OneToOne; // 引入一对一关系注解。
import jakarta.persistence.Table; // 引入表名映射注解。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，减少重复代码。
@Setter // 自动为所有字段生成 setter，减少重复代码。
@Entity // 声明该类是 JPA 实体，会映射到数据库表。
@Table(name = "troc") // 使用 troc 作为数据库表名，匹配类图中的 Troc。
public class Troc { // 定义 Troc 类，对应类图中的 Troc。

    @Id // 标记 id 为主键。
    private Long id; // 保存 Troc 记录唯一编号，同时等于关联的 Posts.id。

    @Column(name = "estimated_price", nullable = false) // 设置估计价格字段不为空，并映射为 estimated_price。
    private Long estimatedPrice; // 保存交换物品估计价值，对应类图中的 estimated price: long。

    @MapsId // 让当前 Troc.id 直接复用关联的 Posts.id，符合类图中类型表 id 表示类别记录的设计。
    @OneToOne(fetch = FetchType.LAZY, optional = false) // 声明每条 Troc 详情必须关联一条 Posts。
    @JoinColumn(name = "id", nullable = false) // 使用 id 作为外键列，连接 posts.id。
    private Posts post; // 保存对应的发布内容，表示这条 Post 的类型是 Troc。
} // 结束 Troc 实体类。
