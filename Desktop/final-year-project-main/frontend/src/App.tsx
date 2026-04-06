import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import MindMapPage from "@/pages/MindMapPage";
import FlowchartPage from "@/pages/FlowchartPage";
import AIGeneratorPage from "@/pages/AIGeneratorPage";
import HelpPage from "@/pages/HelpPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Protected route component
const ProtectedRoute: React.FC<{ component: React.ComponentType<any>; props?: any }> = ({ 
  component: Component, 
  props 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Component {...props} /> : null;
};

function AppContent() {
  const [projectName, setProjectName] = useState<string>("Untitled Project");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  // Simulate loading time for app initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-neutral-50 font-sans text-neutral-800 h-screen flex flex-col overflow-hidden">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar/>
          
          <div className="flex-1 flex overflow-hidden">
            {isAuthenticated && <Sidebar />}
            
            <main className="flex-1 flex flex-col overflow-hidden">
              <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/signup" component={SignupPage} />
                <Route path="/">
                  {() => <ProtectedRoute component={Dashboard} />}
                </Route>
                <Route path="/mindmap/:id?">
                  {(params) => <ProtectedRoute component={MindMapPage} props={{ id: params.id, setProjectName }} />}
                </Route>
                <Route path="/flowchart/:id?">
                  {(params) => <ProtectedRoute component={FlowchartPage} props={{ id: params.id, setProjectName }} />}
                </Route>
                <Route path="/ai-generator">
                  {() => <ProtectedRoute component={AIGeneratorPage} />}
                </Route>
                <Route path="/help">
                  {() => <ProtectedRoute component={HelpPage} />}
                </Route>
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
          
          <Toaster />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
