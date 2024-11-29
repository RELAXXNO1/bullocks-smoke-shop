import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/Loading';
import ErrorFallback from '@/components/ErrorFallback';
import AgeVerification from '@/components/common/AgeVerification';
import ConnectionStatus from '@/components/common/ConnectionStatus';

// Lazy load pages
const StorefrontPreview = React.lazy(() => import('@/pages/StoreFront'));
const Login = React.lazy(() => import('@/pages/auth/Login'));
const Register = React.lazy(() => import('@/pages/auth/Register'));
const Cart = React.lazy(() => import('@/pages/Cart'));
const UserProfile = React.lazy(() => import('@/pages/auth/UserProfile'));
const AdminPanel = React.lazy(() => import('@/components/admin/AdminPanel'));
const About = React.lazy(() => import('@/pages/About'));
const Privacy = React.lazy(() => import('@/pages/Privacy'));
const Terms = React.lazy(() => import('@/pages/Terms'));
const Contact = React.lazy(() => import('@/pages/Contact'));
const Compliance = React.lazy(() => import('@/pages/Compliance'));

// Product pages
const THCAFlower = React.lazy(() => import('@/components/product/THCAFlower'));
const Disposables = React.lazy(() => import('@/components/product/Disposables'));
const Edibles = React.lazy(() => import('@/components/product/Edibles'));
const Mushrooms = React.lazy(() => import('@/components/product/Mushrooms'));
const CBD = React.lazy(() => import('@/components/product/CBD'));
const Kratom = React.lazy(() => import('@/components/product/Kratom'));
const ZeroNic = React.lazy(() => import('@/components/product/ZeroNic'));
const Accessories = React.lazy(() => import('@/components/product/Accessories'));

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <AgeVerification />
            <ConnectionStatus />
            <Header />
            <Suspense fallback={<Loading />}>
              <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <Routes>
                  {/* Main routes */}
                  <Route path="/" element={<StorefrontPreview />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/admin/*" element={<AdminPanel />} />

                  {/* Static pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/compliance" element={<Compliance />} />

                  {/* Product pages */}
                  <Route path="/thca-flower" element={<THCAFlower />} />
                  <Route path="/disposables" element={<Disposables />} />
                  <Route path="/edibles" element={<Edibles />} />
                  <Route path="/mushrooms" element={<Mushrooms />} />
                  <Route path="/cbd" element={<CBD />} />
                  <Route path="/kratom" element={<Kratom />} />
                  <Route path="/zero-nic" element={<ZeroNic />} />
                  <Route path="/accessories" element={<Accessories />} />

                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </Suspense>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;