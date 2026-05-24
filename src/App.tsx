import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingState } from './components/Reusable';

const lazyNamed = <T extends Record<string, React.ComponentType<any>>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K
) => React.lazy(() => loader().then(module => ({ default: module[exportName] })));

const Login = lazyNamed(() => import('./pages/AuthPages'), 'Login');
const Signup = lazyNamed(() => import('./pages/AuthPages'), 'Signup');
const ForgotPassword = lazyNamed(() => import('./pages/AuthPages'), 'ForgotPassword');
const AppShell = lazyNamed(() => import('./components/AppShell'), 'AppShell');
const Dashboard = lazyNamed(() => import('./pages/Dashboard'), 'Dashboard');
const Projects = lazyNamed(() => import('./pages/Projects'), 'Projects');
const Daily = lazyNamed(() => import('./pages/Daily'), 'Daily');
const Weekly = lazyNamed(() => import('./pages/Weekly'), 'Weekly');
const Notes = lazyNamed(() => import('./pages/Notes'), 'Notes');
const Focus = lazyNamed(() => import('./pages/Focus'), 'Focus');
const Analytics = lazyNamed(() => import('./pages/Analytics'), 'Analytics');
const ProfileSettings = lazyNamed(() => import('./pages/ProfileSettings'), 'ProfileSettings');
const Habits = lazyNamed(() => import('./pages/Habits'), 'Habits');
const Mockup = lazyNamed(() => import('./pages/Mockup'), 'Mockup');

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState message="Opening MoTrack..." />}>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected workspace routes */}
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<Projects />} />
            <Route path="/daily" element={<Daily />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/weekly" element={<Weekly />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/mockup" element={<Mockup />} />
            
            {/* Main system catchalls */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
