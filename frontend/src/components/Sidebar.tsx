'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/dashboard/tasks', icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card border-r border-border flex flex-col h-screen sticky top-0 z-20"
    >
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} relative`}>
        <div className="relative w-8 h-8 shrink-0">
          <Image 
            src="/taskflow-logo.png" 
            alt="TaskFlow Logo" 
            fill 
            className="object-contain rounded-lg"
          />
        </div>
        {!isCollapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl font-bold text-foreground tracking-tight whitespace-nowrap overflow-hidden"
          >
            TaskFlow
          </motion.h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-full p-1 shadow-sm hover:bg-muted transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={isCollapsed ? item.name : ''}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`flex items-center w-full p-2 rounded-lg hover:bg-muted transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden text-left">
              <p className="text-sm font-medium text-foreground truncate w-32">{user?.email}</p>
            </div>
          )}
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className={`absolute bottom-full ${isCollapsed ? 'left-full ml-2' : 'left-0 w-full mb-2'} bg-popover border border-border rounded-lg shadow-lg p-1 z-20 min-w-[160px]`}
              >
                <div className="px-2 py-1.5 text-sm font-semibold text-foreground border-b border-border mb-1">
                  My Account
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
