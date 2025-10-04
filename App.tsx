import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Page, User } from './types';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import LearnPage from './pages/LearnPage';
import DirectoryPage from './pages/DirectoryPage';
import SymptomTrackerPage from './pages/SymptomTrackerPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { generateImage } from './services/geminiService';
import { LogoIcon } from './components/icons';
import { getValue, setValue } from './services/dbService';

const AppContent: React.FC = () => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { isTranslationsLoading } = useLanguage();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [previousPage, setPreviousPage] = useState<Page>('home');
  const [isAppInitializing, setIsAppInitializing] = useState(true);
  const prevUserRef = useRef(currentUser);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const aiAvatar = await getValue('aiAssistantAvatar');
        if (!aiAvatar) {
          console.log("No AI assistant avatar found, generating one...");
          const aiAvatarPrompt = "A modern, friendly AI assistant avatar for a dental health app. Stylized tooth logo subtly integrated with a sound wave or a gentle smile curve. Use a clean, minimalist design with a soft color palette of teal (#14b8a6), light blue (#38bdf8), and white. Smooth gradients. Flat 2D vector style. Centered in a circle.";
          const avatarUrl = await generateImage(aiAvatarPrompt);
          await setValue('aiAssistantAvatar', avatarUrl);
        }
      } catch (error) {
        console.error("Failed to initialize app data:", error);
      } finally {
        setIsAppInitializing(false);
      }
    };
    
    initializeApp();
  }, []);

  const navigate = useCallback((page: Page) => {
    if (page === 'auth') {
      setPreviousPage(currentPage);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    // If user just logged in (was null, now has value)
    if (!prevUserRef.current && currentUser) {
        if (currentPage === 'auth') {
            navigate('home'); // Redirect home after login
        }
    }
    // If user just logged out
    else if (prevUserRef.current && !currentUser) {
        const protectedPages: Page[] = ['profile', 'tracker'];
        if (protectedPages.includes(currentPage)) {
            navigate('home'); // Redirect home if they log out from a protected page
        }
    }
    prevUserRef.current = currentUser;
  }, [currentUser, currentPage, navigate]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} />;
      case 'chat':
        return <ChatPage onNavigate={navigate} />;
      case 'learn':
        return <LearnPage onNavigate={navigate} />;
      case 'directory':
        return <DirectoryPage onNavigate={navigate} />;
      case 'tracker':
        return <SymptomTrackerPage onNavigate={navigate} />;
      case 'community':
        return <CommunityPage onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'auth':
        return <AuthPage onNavigateBack={() => navigate(previousPage)} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  if (isAuthLoading || isAppInitializing || isTranslationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <LogoIcon className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">{renderPage()}</div>
    </ThemeProvider>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;