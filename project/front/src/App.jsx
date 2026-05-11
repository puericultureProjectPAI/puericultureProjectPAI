import "./App.css"; // 引入应用级 CSS 文件。
import InstallPWA from "./common/components/InstallPWA"; // 引入 PWA 安装提示组件。
import PublishAnnouncementView from "./troc/views/PublishAnnouncementView"; // 引入 US1 发布公告页面。

function App() { // 定义应用根组件。
  return ( // 返回应用整体页面。
    <div className="min-h-screen bg-white">
      {/* PWA 安装提示组件，保留原项目已有能力。 */}
      <InstallPWA />
      {/* Troc US1 页面，包含发布表单和公告列表。 */}
      <PublishAnnouncementView />
    </div>
  ); // 结束 return。
} // 结束 App 组件。

export default App; // 导出 App 组件，供 main.jsx 挂载。
