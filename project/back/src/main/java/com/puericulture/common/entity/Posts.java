package com.puericulture.common.entity; // 定义发布内容实体所在的公共实体包。

import com.puericulture.forwardtrading.entity.ForwardTrading; // 引入 ForwardTrading 类型实体，用来表示转送类发布。
import com.puericulture.leasing.entity.Leasing; // 引入 Leasing 类型实体，用来表示租赁类发布。
import com.puericulture.secondhand.entity.SecondHand; // 引入 SecondHand 类型实体，用来表示二手类发布。
import com.puericulture.troc.entity.Troc; // 引入 Troc 类型实体，用来表示交换类发布。
import jakarta.persistence.CascadeType; // 引入级联类型，用来同步保存或删除关联实体。
import jakarta.persistence.Column; // 引入字段映射注解，用来配置数据库列。
import jakarta.persistence.Entity; // 引入实体注解，用来声明这是数据库实体。
import jakarta.persistence.FetchType; // 引入加载策略枚举，用来配置关联加载方式。
import jakarta.persistence.GeneratedValue; // 引入主键生成策略注解。
import jakarta.persistence.GenerationType; // 引入主键生成类型枚举。
import jakarta.persistence.Id; // 引入主键注解。
import jakarta.persistence.JoinColumn; // 引入外键列注解，用来配置 author 外键。
import jakarta.persistence.ManyToOne; // 引入多对一关系注解，用来表示多个帖子属于一个用户。
import jakarta.persistence.OneToOne; // 引入一对一关系注解，用来表示帖子和类型详情的一对一关系。
import jakarta.persistence.Table; // 引入表名映射注解。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，减少重复代码。
@Setter // 自动为所有字段生成 setter，减少重复代码。
@Entity // 声明该类是 JPA 实体，会映射到数据库表。
@Table(name = "posts") // 使用 posts 作为数据库表名，匹配类图里的 Posts。
public class Posts { // 定义 Posts 类，对应类图中的 Posts。

    @Id // 标记 id 为主键。
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 使用数据库自增策略生成主键。
    private Long id; // 保存发布内容唯一编号，对应类图中的 id: long。

    @Column(name = "images_references") // 指定数据库列名为 images_references。
    private String imagesReferences; // 保存图片引用路径，对应类图中的 ImagesReferences: String。

    @Column(nullable = false) // 设置标题不为空。
    private String title; // 保存发布标题，对应类图中的 title: String。

    @Column(nullable = false, length = 2000) // 设置描述不为空，并允许更长文本。
    private String description; // 保存发布描述，对应类图中的 description: String。

    @Column(nullable = false) // 设置 open 字段不为空。
    private boolean open = true; // 保存发布是否开放，对应类图中的 open: boolean。

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // 声明多个 Posts 可以属于同一个 User，且作者不能为空。
    @JoinColumn(name = "author_id", nullable = false) // 使用 author_id 作为外键列，连接 users 表。
    private User author; // 保存发布作者，对应类图中的 Author 关系。

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // 声明该帖子最多关联一个 Troc 类型详情。
    private Troc troc; // 保存交换类型详情，对应类图中 Posts 1 到 Troc 0..1。

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // 声明该帖子最多关联一个 SecondHand 类型详情。
    private SecondHand secondHand; // 保存二手类型详情，对应类图中 Posts 1 到 SecondHand 0..1。

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // 声明该帖子最多关联一个 Leasing 类型详情。
    private Leasing leasing; // 保存租赁类型详情，对应类图中 Posts 1 到 Leasing 0..1。

    @OneToOne(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY) // 声明该帖子最多关联一个 ForwardTrading 类型详情。
    private ForwardTrading forwardTrading; // 保存转送类型详情，对应类图中 Posts 1 到 ForwardTrading 0..1。
} // 结束 Posts 实体类。
