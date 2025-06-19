// 'use client';
// import "@/css/satoshi.css";
// import "@/css/style.css";

// import { Sidebar } from "@/components/Layouts/sidebar";

// import "flatpickr/dist/flatpickr.min.css";
// import "jsvectormap/dist/jsvectormap.css";

// import { Header } from "@/components/Layouts/header";
// import type { Metadata } from "next";
// import NextTopLoader from "nextjs-toploader";
// import type { PropsWithChildren } from "react";
// import { Providers } from "./providers";
// import { usePathname } from 'next/navigation';

// // Note: Move metadata to a separate file or handle it differently since this is now a client component
// // You can create a separate metadata.ts file or use generateMetadata in page components

// export default function RootLayout({ children }: PropsWithChildren) {
//   const pathname = usePathname();
  
//   // Define auth routes that shouldn't show sidebar/header
//   const isAuthPage = pathname === '/signin' || pathname.startsWith('/auth');

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <Providers>
//           <NextTopLoader color="#5750F1" showSpinner={false} />

//           {isAuthPage ? (
//             // Auth layout - no sidebar/header
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//               {children}
//             </div>
//           ) : (
//             // Regular layout with sidebar and header
//             <div className="flex min-h-screen">
//               <Sidebar />

//               <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
//                 <Header />

//                 <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
//                   {children}
//                 </main>
//               </div>
//             </div>
//           )}
//         </Providers>
//       </body>
//     </html>
//   );
// }

'use client';
import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/signin', '/auth/signin', '/auth/signup', '/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  
  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Only redirect if we're not already on a public route
          if (!isPublicRoute) {
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        if (!isPublicRoute) {
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [pathname, router, isPublicRoute]);

  // Handle authenticated user trying to access auth pages
  useEffect(() => {
    if (isAuthenticated && isPublicRoute) {
      router.push('/'); // Redirect to dashboard or home
    }
  }, [isAuthenticated, isPublicRoute, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </body>
      </html>
    );
  }

  // Don't render protected content if not authenticated (except for public routes)
  if (!isAuthenticated && !isPublicRoute) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Redirecting to login...
              </h2>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          {isPublicRoute ? (
            // Auth layout - no sidebar/header
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              {children}
            </div>
          ) : (
            // Regular layout with sidebar and header (only for authenticated users)
            <div className="flex min-h-screen">
              <Sidebar />

              <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                <Header />

                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                  {children}
                </main>
              </div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}