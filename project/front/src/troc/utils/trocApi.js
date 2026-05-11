import axios from "axios"; // 引入 axios，用来发送前端到后端的 HTTP 请求。

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; // 读取环境变量里的后端地址，没有配置时默认使用本地 8080。

const trocApi = axios.create({ // 创建 troc 模块专用 axios 实例。
  baseURL: `${API_BASE_URL}/troc/posts`, // 设置当前 US1 使用的接口前缀，对应后端 /troc/posts。
  headers: { // 设置默认请求头。
    "Content-Type": "application/json", // 告诉后端请求体是 JSON 格式。
  }, // 结束 headers 配置。
}); // 结束 axios 实例创建。

export async function createTrocPost(payload) { // 定义创建 Troc 公告的 API 函数。
  const response = await trocApi.post("", payload); // 发送 POST 请求，把表单数据保存到数据库。
  return response.data; // 返回后端创建成功后的公告数据。
} // 结束 createTrocPost 函数。

export async function getTrocPosts() { // 定义获取 Troc 公告列表的 API 函数。
  const response = await trocApi.get(""); // 发送 GET 请求，读取所有开放中的 Troc 公告。
  return response.data; // 返回后端公告列表数据。
} // 结束 getTrocPosts 函数。
