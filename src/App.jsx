import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PublicSiteProvider } from './context/PublicSiteContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const ChangePassword = lazy(() => import('./pages/admin/ChangePassword'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminHeroImages = lazy(() => import('./pages/admin/AdminHeroImages'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const ReportIssueWidget = lazy(() => import('./components/ReportIssueWidget'));

const RouteLoader = () => (
  <div
    style={{
      minHeight: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--clr-text-muted)',
    }}
  >
    Loading...
  </div>
);

const MainLayout = () => (
  <PublicSiteProvider>
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Suspense fallback={<RouteLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ReportIssueWidget />
      </Suspense>
    </div>
  </PublicSiteProvider>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="about" element={<About />} />
          </Route>

          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<RouteLoader />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/change-password"
            element={
              <Suspense fallback={<RouteLoader />}>
                <ChangePassword />
              </Suspense>
            }
          />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminDashboard />
                  </Suspense>
                }
              />
              <Route
                path="inventory"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminInventory />
                  </Suspense>
                }
              />
              <Route
                path="categories"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminCategories />
                  </Suspense>
                }
              />
              <Route
                path="orders"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminOrders />
                  </Suspense>
                }
              />
              <Route
                path="users"
                element={<div className="admin-page"><div className="card"><h2>User Management</h2><p style={{ color: 'var(--clr-text-muted)' }}>Coming soon.</p></div></div>}
              />
              <Route
                path="messages"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminMessages />
                  </Suspense>
                }
              />
              <Route
                path="hero-images"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminHeroImages />
                  </Suspense>
                }
              />
              <Route
                path="settings"
                element={
                  <Suspense fallback={<RouteLoader />}>
                    <AdminSettings />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
