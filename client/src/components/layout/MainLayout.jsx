import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="content-area">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
