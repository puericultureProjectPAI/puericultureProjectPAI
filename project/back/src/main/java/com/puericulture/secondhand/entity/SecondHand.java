package com.puericulture.secondhand.entity; // 定义二手类型实体所在的 secondhand 实体包。

import com.puericulture.common.entity.Posts; // 引入 Posts 抽象父类，用来继承公告公共字段。
import jakarta.persistence.Column; // 引入字段映射注解，用来配置数据库列。
import jakarta.persistence.Entity; // 引入实体注解，用来声明这是数据库实体。
import jakarta.persistence.PrimaryKeyJoinColumn; // 引入主键连接注解，用来让 second_hand.id 同时引用 posts.id。
import jakarta.persistence.Table; // 引入表名映射注解。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，减少重复代码。
@Setter // 自动为所有字段生成 setter，减少重复代码。
@Entity // 声明该类是 JPA 实体，会映射到数据库表。
@Table(name = "second_hand") // 使用 second_hand 作为数据库表名，匹配类图中的 SecondHand。
@PrimaryKeyJoinColumn(name = "id") // 指定 second_hand.id 是继承自 posts.id 的共享主键。
public class SecondHand extends Posts { // 定义 SecondHand 子类，继承 Posts 的公共字段和 id。

    @Column(nullable = false) // 设置价格字段不为空。
    private Long price; // 保存二手出售价格，对应类图中的 price: long。

    @Column(nullable = false) // 设置物品状态字段不为空。
    private String condition; // 保存物品成色或状态，对应类图中的 Condition: String。
} // 结束 SecondHand 实体类。
