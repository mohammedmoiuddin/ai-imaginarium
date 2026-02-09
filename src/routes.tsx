import type { ReactNode } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PromptBasicsPage from './pages/PromptBasicsPage';
import PromptingLevelsPage from './pages/PromptingLevelsPage';
import WritingGuidePage from './pages/WritingGuidePage';
import ComparisonPage from './pages/ComparisonPage';
import PlaygroundPage from './pages/PlaygroundPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import QuizzesPage from './pages/QuizzesPage';
import ForumPage from './pages/ForumPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Register',
    path: '/register',
    element: <RegisterPage />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    name: 'Prompt Basics',
    path: '/learn/basics',
    element: <PromptBasicsPage />,
  },
  {
    name: 'Prompting Levels',
    path: '/learn/levels',
    element: <PromptingLevelsPage />,
  },
  {
    name: 'Writing Guide',
    path: '/learn/guide',
    element: <WritingGuidePage />,
  },
  {
    name: 'Good vs Bad',
    path: '/learn/comparison',
    element: <ComparisonPage />,
  },
  {
    name: 'Playground',
    path: '/playground',
    element: <PlaygroundPage />,
  },
  {
    name: 'Prompt Library',
    path: '/library',
    element: <PromptLibraryPage />,
  },
  {
    name: 'Quizzes',
    path: '/quizzes',
    element: <QuizzesPage />,
  },
  {
    name: 'Forum',
    path: '/forum',
    element: <ForumPage />,
  },
  {
    name: 'Discussion Detail',
    path: '/forum/:id',
    element: <DiscussionDetailPage />,
    visible: false,
  },
  {
    name: 'Achievements',
    path: '/achievements',
    element: <AchievementsPage />,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
];

export default routes;
