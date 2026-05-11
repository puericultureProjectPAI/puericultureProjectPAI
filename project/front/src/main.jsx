import React from "react"; // 引入 React，用来渲染组件树。
import { createRoot } from "react-dom/client"; // 引入 createRoot，用来创建 React 入口。
import { BrowserRouter } from "react-router-dom"; // 引入 BrowserRouter，为后续路由页面提供上下文。
import App from "./App.jsx"; // 引入根组件 App。
import "./index.css"; // 引入 Tailwind 和全局样式。
import { registerSW } from "virtual:pwa-register"; // 引入 PWA Service Worker 注册方法。

const updateSW = registerSW({ // 注册 Service Worker，并保存更新函数。
  onNeedRefresh() { // 当检测到新版本时执行该回调。
    const userWantsToUpdate = confirm("A new app version is available. Reload now?"); // 询问用户是否立即刷新到新版本。
    if (userWantsToUpdate) { // 如果用户同意刷新。
      updateSW(true); // 清理旧缓存并加载新版本。
    } // 结束用户确认判断。
  }, // 结束 onNeedRefresh 回调。
  onOfflineReady() { // 当应用可以离线使用时执行该回调。
    console.log("PWA Engine: The app is now ready to work offline."); // 在控制台提示 PWA 离线能力已准备好。
  }, // 结束 onOfflineReady 回调。
}); // 结束 Service Worker 注册配置。

createRoot(document.getElementById("root")).render( // 找到 HTML 根节点并渲染 React 应用。
  <React.StrictMode>
    {/* 开启 React 严格模式，帮助开发阶段发现潜在问题。 */}
    <BrowserRouter>
      {/* 提供浏览器路由上下文。 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
); // 结束 React 渲染。
