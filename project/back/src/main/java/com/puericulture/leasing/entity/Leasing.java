package com.puericulture.leasing.entity; // 定义租赁类型实体所在的 leasing 实体包。

import com.puericulture.common.entity.Posts; // 引入 Posts 抽象父类，用来继承公告公共字段。
import jakarta.persistence.Column; // 引入字段映射注解，用来配置数据库列。
import jakarta.persistence.Entity; // 引入实体注解，用来声明这是数据库实体。
import jakarta.persistence.PrimaryKeyJoinColumn; // 引入主键连接注解，用来让 leasing.id 同时引用 posts.id。
import jakarta.persistence.Table; // 引入表名映射注解。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，减少重复代码。
@Setter // 自动为所有字段生成 setter，减少重复代码。
@Entity // 声明该类是 JPA 实体，会映射到数据库表。
@Table(name = "leasing") // 使用 leasing 作为数据库表名，匹配类图中的 Leasing。
@PrimaryKeyJoinColumn(name = "id") // 指定 leasing.id 是继承自 posts.id 的共享主键。
public class Leasing extends Posts { // 定义 Leasing 子类，继承 Posts 的公共字段和 id。

    @Column(nullable = false) // 设置价格字段不为空。
    private Long price; // 保存租赁价格，对应类图中的 price: long。

    @Column(nullable = false) // 设置租赁时长字段不为空。
    private Long duration; // 保存租赁天数，对应类图中的 duration in days: long。
} // 结束 Leasing 实体类。
