import { useCallback, useEffect, useState } from "react"; // 引入 React hooks，用来管理列表状态和加载流程。
import { createTrocPost, getTrocPosts } from "../utils/trocApi"; // 引入 troc API 函数，保证请求逻辑集中在 utils 层。

export function useTrocPosts() { // 定义 Troc 公告 hook，给页面统一提供数据和操作。
  const [posts, setPosts] = useState([]); // 保存公告列表数据。
  const [loading, setLoading] = useState(false); // 保存加载状态，用来显示加载提示。
  const [error, setError] = useState(""); // 保存错误信息，用来显示给用户。
  const [success, setSuccess] = useState(""); // 保存成功信息，用来反馈发布结果。

  const loadPosts = useCallback(async () => { // 定义加载公告列表的方法，并用 useCallback 保持引用稳定。
    setLoading(true); // 开始加载时打开 loading。
    setError(""); // 每次重新加载前清空旧错误。
    try { // 捕获接口请求中可能出现的错误。
      const data = await getTrocPosts(); // 调用 GET /troc/posts 获取公告列表。
      setPosts(data); // 把后端返回的数据保存到页面状态。
    } catch (requestError) { // 捕获后端或网络错误。
      setError("Impossible de charger les annonces pour le moment."); // 设置用户可读的法语错误提示。
      console.error("Erreur chargement annonces", requestError); // 在控制台打印技术错误，方便开发调试。
    } finally { // 无论成功或失败都执行收尾逻辑。
      setLoading(false); // 加载结束后关闭 loading。
    } // 结束 try/catch/finally。
  }, []); // 依赖为空，表示该函数不会因为普通渲染而重建。

  const publishPost = async (values) => { // 定义发布公告的方法，供表单提交时调用。
    setError(""); // 提交前清空旧错误。
    setSuccess(""); // 提交前清空旧成功信息。
    try { // 捕获创建公告时可能出现的错误。
      await createTrocPost(values); // 调用 POST /troc/posts 创建公告。
      setSuccess("Annonce publiée avec succès."); // 设置发布成功提示。
      await loadPosts(); // 发布成功后重新加载列表，满足“出现在列表中”的验收标准。
      return true; // 返回 true，让表单知道提交成功并清空输入。
    } catch (requestError) { // 捕获后端校验或网络错误。
      setError("Impossible de publier l’annonce. Vérifiez les champs obligatoires."); // 设置用户可读的法语错误提示。
      console.error("Erreur publication annonce", requestError); // 在控制台打印技术错误，方便开发调试。
      return false; // 返回 false，让表单保留输入，方便用户修改。
    } // 结束 try/catch。
  }; // 结束 publishPost 方法。

  useEffect(() => { // 页面首次加载时执行副作用。
    loadPosts(); // 自动加载已有公告列表。
  }, [loadPosts]); // 依赖 loadPosts，保证 React hooks 规则正确。

  return { posts, loading, error, success, publishPost, loadPosts }; // 返回页面需要的状态和操作方法。
} // 结束 useTrocPosts hook。
