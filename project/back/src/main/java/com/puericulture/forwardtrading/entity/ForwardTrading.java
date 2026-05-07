package com.puericulture.forwardtrading.entity; // 定义转送类型实体所在的 forwardtrading 实体包。

import com.puericulture.common.entity.Posts; // 引入 Posts 实体，用来关联一条发布内容。
import jakarta.persistence.Entity; // 引入实体注解，用来声明这是数据库实体。
import jakarta.persistence.FetchType; // 引入加载策略枚举，用来配置关联加载方式。
import jakarta.persistence.Id; // 引入主键注解。
import jakarta.persistence.JoinColumn; // 引入外键列注解，用来配置共享主键外键。
import jakarta.persistence.MapsId; // 引入共享主键注解，用来让 ForwardTrading.id 等于 Posts.id。
import jakarta.persistence.OneToOne; // 引入一对一关系注解。
import jakarta.persistence.Table; // 引入表名映射注解。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，减少重复代码。
@Setter // 自动为所有字段生成 setter，减少重复代码。
@Entity // 声明该类是 JPA 实体，会映射到数据库表。
@Table(name = "forward_trading") // 使用 forward_trading 作为数据库表名，匹配类图中的 ForwardTrading。
public class ForwardTrading { // 定义 ForwardTrading 类，对应类图中的 ForwardTrading。

    @Id // 标记 id 为主键。
    private Long id; // 保存 ForwardTrading 记录唯一编号，同时等于关联的 Posts.id。

    @MapsId // 让当前 ForwardTrading.id 直接复用关联的 Posts.id。
    @OneToOne(fetch = FetchType.LAZY, optional = false) // 声明每条 ForwardTrading 详情必须关联一条 Posts。
    @JoinColumn(name = "id", nullable = false) // 使用 id 作为外键列，连接 posts.id。
    private Posts post; // 保存对应的发布内容，表示这条 Post 的类型是 ForwardTrading。
} // 结束 ForwardTrading 实体类。
