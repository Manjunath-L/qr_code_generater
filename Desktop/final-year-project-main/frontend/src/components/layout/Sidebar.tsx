import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-16 md:w-64 bg-white border-r border-neutral-200 flex flex-col transition-all duration-300">
      {/* Narrow Sidebar (Mobile) */}
      <div className="md:hidden flex flex-col items-center py-4 space-y-4">
        <Link href="/">
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${isActive("/") ? "bg-primary-50 text-primary-500" : "hover:bg-neutral-100"}`}
          >
            <span className="material-icons">view_module</span>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
        </Link>
        <Link href="/mindmap">
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${isActive("/mindmap") ? "bg-primary-50 text-primary-500" : "hover:bg-neutral-100"}`}
          >
            <span className="material-icons">share</span>
            <span className="text-xs mt-1">Mindmap</span>
          </button>
        </Link>
        <Link href="/flowchart">
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${isActive("/flowchart") ? "bg-primary-50 text-primary-500" : "hover:bg-neutral-100"}`}
          >
            <span className="material-icons">account_tree</span>
            <span className="text-xs mt-1">Flowchart</span>
          </button>
        </Link>
        <Link href="/ai-generator">
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${isActive("/ai-generator") ? "bg-primary-50 text-primary-500" : "hover:bg-neutral-100"}`}
          >
            <span className="material-icons">auto_awesome</span>
            <span className="text-xs mt-1">AI</span>
          </button>
        </Link>
        <Link href="/help">
          <button
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${isActive("/help") ? "bg-primary-50 text-primary-500" : "hover:bg-neutral-100"}`}
          >
            <span className="material-icons">help_outline</span>
            <span className="text-xs mt-1">Help</span>
          </button>
        </Link>
      </div>

      {/* Wide Sidebar (Desktop) */}
      <div className="hidden md:flex md:flex-col md:flex-1">
        <div className="px-4 py-4 space-y-1">
          <Link href="/">
            <button
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${isActive("/") ? "bg-primary-50 text-primary-500" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}
            >
              <span
                className={`material-icons mr-3 ${isActive("/") ? "text-primary-500" : "text-neutral-400"}`}
              >
                view_module
              </span>
              Dashboard
            </button>
          </Link>
          <Link href="/mindmap">
            <button
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${isActive("/mindmap") ? "bg-primary-50 text-primary-500" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}
            >
              <span
                className={`material-icons mr-3 ${isActive("/mindmap") ? "text-primary-500" : "text-neutral-400"}`}
              >
                share
              </span>
              Mind Map
            </button>
          </Link>
          <Link href="/flowchart">
            <button
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${isActive("/flowchart") ? "bg-primary-50 text-primary-500" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}
            >
              <span
                className={`material-icons mr-3 ${isActive("/flowchart") ? "text-primary-500" : "text-neutral-400"}`}
              >
                account_tree
              </span>
              Flowchart
            </button>
          </Link>
          <Link href="/ai-generator">
            <button
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${isActive("/ai-generator") ? "bg-primary-50 text-primary-500" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}
            >
              <span
                className={`material-icons mr-3 ${isActive("/ai-generator") ? "text-primary-500" : "text-neutral-400"}`}
              >
                auto_awesome
              </span>
               Generator
            </button>
          </Link>
        </div>

        <div className="flex-1"></div>

        <div className="border-t border-neutral-200 dark:border-gray-800 px-4 py-4 space-y-1">
          <Link href="/help">
            <button className={`flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${isActive("/help") ? "bg-primary-50 text-primary-500" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}>
              <span className={`material-icons mr-3 ${isActive("/help") ? "text-primary-500" : "text-neutral-400"}`}>
                help_outline
              </span>
              Help
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
