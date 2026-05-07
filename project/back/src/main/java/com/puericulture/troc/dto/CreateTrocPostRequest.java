package com.puericulture.troc.dto; // 定义创建交换公告请求 DTO 所在的 troc dto 包。

import jakarta.validation.constraints.NotBlank; // 引入非空字符串校验注解。
import jakarta.validation.constraints.NotNull; // 引入非空对象校验注解。
import jakarta.validation.constraints.PositiveOrZero; // 引入非负数校验注解。
import lombok.Getter; // 引入 Lombok Getter，自动生成 getter 方法。
import lombok.Setter; // 引入 Lombok Setter，自动生成 setter 方法。

@Getter // 自动为所有字段生成 getter，方便 Controller 接收请求数据。
@Setter // 自动为所有字段生成 setter，方便 JSON 反序列化赋值。
public class CreateTrocPostRequest { // 定义创建 Troc 类型公告的请求对象。

    @NotBlank(message = "Le titre est obligatoire") // 校验标题不能为空，对应 US1 必填字段错误提示。
    private String title; // 保存公告标题，对应表单里的 titre。

    @NotBlank(message = "La description est obligatoire") // 校验描述不能为空，对应 US1 必填字段错误提示。
    private String description; // 保存公告描述，对应表单里的 description。

    private String imagesReferences; // 保存图片引用，先按类图使用字符串，不做复杂上传。

    @NotNull(message = "Le prix estimé est obligatoire") // 校验估计价格不能为空，因为 Troc 表需要 estimated price。
    @PositiveOrZero(message = "Le prix estimé doit être positif ou égal à zéro") // 校验估计价格不能为负数。
    private Long estimatedPrice; // 保存交换物品估计价值，对应 Troc.estimatedPrice。

    private Long authorId; // 保存作者编号；登录模块未完成时允许为空并使用默认测试用户。
} // 结束 CreateTrocPostRequest 类。
