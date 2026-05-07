package com.puericulture.troc.service; // 定义交换公告业务服务所在的 troc service 包。

import com.puericulture.common.entity.Posts; // 引入 Posts 实体，用来创建公告基础信息。
import com.puericulture.common.entity.User; // 引入 User 实体，用来设置公告作者。
import com.puericulture.common.repository.PostsRepository; // 引入 PostsRepository，用来保存和查询公告。
import com.puericulture.common.repository.UserRepository; // 引入 UserRepository，用来查询或创建作者。
import com.puericulture.troc.dto.CreateTrocPostRequest; // 引入创建请求 DTO，用来接收前端表单数据。
import com.puericulture.troc.dto.TrocPostResponse; // 引入响应 DTO，用来返回创建结果和列表数据。
import com.puericulture.troc.entity.Troc; // 引入 Troc 实体，用来保存交换类型详情。
import com.puericulture.troc.mapper.TrocPostMapper; // 引入 mapper，用来把实体转换为响应 DTO。
import com.puericulture.troc.repository.TrocRepository; // 引入 TrocRepository，用来保存和查询交换类型详情。
import java.util.List; // 引入 List，用来返回多条公告。
import org.springframework.http.HttpStatus; // 引入 HTTP 状态码，用来抛出业务错误。
import org.springframework.stereotype.Service; // 引入 Service 注解，用来注册业务服务 Bean。
import org.springframework.transaction.annotation.Transactional; // 引入事务注解，用来保证 Post 和 Troc 同时保存成功。
import org.springframework.web.server.ResponseStatusException; // 引入响应状态异常，用来返回清晰的错误信息。

@Service // 声明该类是 Spring 业务服务。
public class TrocPostService { // 定义 TrocPostService，集中处理 US1 发布交换公告逻辑。

    private static final String DEFAULT_AUTHOR_EMAIL = "demo.parent@puericulture.local"; // 定义临时默认作者邮箱，等待登录模块完成后替换为当前用户。

    private final PostsRepository postsRepository; // 保存 PostsRepository 依赖，用来操作 posts 表。

    private final TrocRepository trocRepository; // 保存 TrocRepository 依赖，用来操作 troc 表。

    private final UserRepository userRepository; // 保存 UserRepository 依赖，用来操作 users 表。

    public TrocPostService(PostsRepository postsRepository, TrocRepository trocRepository, UserRepository userRepository) { // 通过构造函数注入 repository 依赖。
        this.postsRepository = postsRepository; // 保存 postsRepository 到当前服务。
        this.trocRepository = trocRepository; // 保存 trocRepository 到当前服务。
        this.userRepository = userRepository; // 保存 userRepository 到当前服务。
    } // 结束构造函数。

    @Transactional // 开启事务，保证创建 Posts 和 Troc 要么一起成功，要么一起回滚。
    public TrocPostResponse createTrocPost(CreateTrocPostRequest request) { // 创建一条 Troc 类型公告，对应 US1 的提交表单。
        User author = resolveAuthor(request.getAuthorId()); // 根据 authorId 找作者，若没有登录信息则使用默认测试作者。
        Posts post = new Posts(); // 创建 Posts 实体，用来保存公告基础字段。
        post.setTitle(request.getTitle()); // 设置公告标题。
        post.setDescription(request.getDescription()); // 设置公告描述。
        post.setImagesReferences(request.getImagesReferences()); // 设置图片引用，当前版本只存字符串。
        post.setOpen(true); // 新发布的公告默认开放给其他用户查看。
        post.setAuthor(author); // 设置公告作者，匹配类图中的 Author 关系。
        Troc troc = new Troc(); // 创建 Troc 实体，用来表示这条公告的类型是交换。
        troc.setEstimatedPrice(request.getEstimatedPrice()); // 设置交换物品估计价值。
        troc.setPost(post); // 让 Troc 关联刚创建的 Posts。
        post.setTroc(troc); // 让 Posts 也关联 Troc，保持双向关系一致。
        Posts savedPost = postsRepository.save(post); // 保存 Posts，并通过级联同时保存 Troc。
        return TrocPostMapper.toResponse(savedPost, savedPost.getTroc()); // 把保存后的实体转换成前端响应。
    } // 结束 createTrocPost 方法。

    @Transactional(readOnly = true) // 开启只读事务，提升查询语义清晰度。
    public List<TrocPostResponse> findOpenTrocPosts() { // 查询开放中的 Troc 公告列表，对应列表展示验收标准。
        return trocRepository.findAll().stream() // 从 troc 表读取所有交换类型记录并转成流。
                .filter(troc -> troc.getPost().isOpen()) // 只保留仍然开放的公告。
                .map(troc -> TrocPostMapper.toResponse(troc.getPost(), troc)) // 把每条实体转换成响应 DTO。
                .toList(); // 收集为不可变列表返回。
    } // 结束 findOpenTrocPosts 方法。

    private User resolveAuthor(Long authorId) { // 解析公告作者，临时兼容未完成登录模块的情况。
        if (authorId != null) { // 如果前端传入了作者 id，则优先使用真实作者。
            return userRepository.findById(authorId) // 根据作者 id 查询用户。
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Auteur introuvable")); // 如果作者不存在，则返回 404 错误。
        } // 结束 authorId 非空分支。
        return userRepository.findByEmail(DEFAULT_AUTHOR_EMAIL) // 如果没有作者 id，则尝试查找默认测试作者。
                .orElseGet(this::createDefaultAuthor); // 如果默认测试作者不存在，则立即创建一个。
    } // 结束 resolveAuthor 方法。

    private User createDefaultAuthor() { // 创建默认测试作者，保证 US1 在没有登录模块时也能跑通。
        User user = new User(); // 创建 User 实体。
        user.setEmail(DEFAULT_AUTHOR_EMAIL); // 设置默认测试作者邮箱。
        user.setName("Parent"); // 设置默认测试作者姓氏。
        user.setFirstname("Demo"); // 设置默认测试作者名字。
        user.setPassword("temporary-password"); // 设置临时密码，后续应由认证模块接管。
        user.setCity("Lille"); // 设置默认城市，方便本地演示。
        user.setStreet("Rue de démonstration"); // 设置默认街道，方便本地演示。
        return userRepository.save(user); // 保存默认作者并返回。
    } // 结束 createDefaultAuthor 方法。
} // 结束 TrocPostService 类。
