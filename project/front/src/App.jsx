import "./App.css";
import InstallPWA from "./common/components/InstallPWA";
import PublishAnnouncementView from "./troc/views/PublishAnnouncementView";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <InstallPWA />
      <PublishAnnouncementView />
    </div>
  );
}

export default App;
