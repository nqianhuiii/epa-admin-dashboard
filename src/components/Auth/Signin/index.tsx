// /components/Auth/Signin.tsx
'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsLoading(true);

  //   const result = await login(email, password);
    
  //   if (!result.success) {
  //     setError(result.error || 'Login failed');
  //   }else{
  //     window.location.href = '/users'; 
  //   }
    
  //   setIsLoading(false);
  // };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  const result = await login(email, password);
  
  if (!result.success) {
    setError(result.error || 'Login failed');
  }
  // Don't manually redirect here - let the useAuth context handle it
  
  setIsLoading(false);
}

  return (
    <>
      <span className="mb-1.5 block font-medium">Start for free</span>
      <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Sign In to TailAdmin
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />

            <span className="absolute right-4 top-4">
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.46567C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                    fill=""
                  />
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="6+ Characters, 1 Capital letter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />

            <span className="absolute right-4 top-4">
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.825009C8.86719 0.825009 6.80469 3.16251 6.80469 5.91251V6.80626C3.84844 7.18438 1.5 9.64063 1.5 12.6656V14.8219C1.5 18.0938 4.19219 20.7859 7.46406 20.7859H15.5359C18.8078 20.7859 21.5 18.0938 21.5 14.8219V12.6656C21.5 9.64063 19.1516 7.18438 16.1547 6.80626ZM8.55781 5.91251C8.55781 4.20313 9.77031 2.99063 11.4797 2.99063C13.1891 2.99063 14.4016 4.20313 14.4016 5.91251V6.65626C13.4797 6.49688 12.5016 6.41251 11.4797 6.41251C10.4578 6.41251 9.47969 6.49688 8.55781 6.65626V5.91251ZM19.9141 14.8219C19.9141 17.1641 18.1078 19.0156 15.5359 19.0156H7.46406C4.89219 19.0156 3.08594 17.1641 3.08594 14.8219V12.6656C3.08594 10.3234 4.89219 8.47188 7.46406 8.47188H15.5359C18.1078 8.47188 19.9141 10.3234 19.9141 12.6656V14.8219Z"
                    fill=""
                  />
                  <path
                    d="M11.4797 11.8594C10.0547 11.8594 8.90625 13.0078 8.90625 14.4328C8.90625 15.8578 10.0547 17.0063 11.4797 17.0063C12.9047 17.0063 14.0531 15.8578 14.0531 14.4328C14.0531 13.0078 12.9047 11.8594 11.4797 11.8594ZM11.4797 15.4516C11.0234 15.4516 10.6609 15.0891 10.6609 14.6328C10.6609 14.1766 11.0234 13.8141 11.4797 13.8141C11.9359 13.8141 12.2984 14.1766 12.2984 14.6328C12.2984 15.0891 11.9359 15.4516 11.4797 15.4516Z"
                    fill=""
                  />
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border border-stroke bg-transparent text-primary focus:ring-primary dark:border-form-strokedark"
              />
              <label htmlFor="remember" className="text-sm font-medium text-black dark:text-white">
                Remember me
              </label>
            </div>
            
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => alert('Contact administrator for password reset')}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-5">
          <input
            type="submit"
            disabled={isLoading}
            value={isLoading ? "Signing In..." : "Sign In"}
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
          onClick={() => alert('Google sign-in not available for admin panel')}
        >
          <span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_191_13499)">
                <path
                  d="M19.999 10.2217C20.0111 9.53428 19.9387 8.84788 19.7834 8.17737H10.2031V11.8884H15.8266C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.9986 13.2661 19.9986 10.2217"
                  fill="#4285F4"
                />
                <path
                  d="M10.2055 19.9999C12.9605 19.9999 15.2734 19.111 16.9629 17.5777L13.7429 15.1331C12.8813 15.7221 11.7248 16.1333 10.2055 16.1333C8.91513 16.1259 7.65991 15.7205 6.61791 14.9745C5.57592 14.2286 4.80007 13.1801 4.40044 11.9777L4.28085 11.9877L1.13101 14.3765L1.08984 14.4887C1.93817 16.1456 3.24007 17.5386 4.84997 18.5118C6.45987 19.4851 8.31429 20.0004 10.2059 19.9999"
                  fill="#34A853"
                />
                <path
                  d="M4.39899 11.9777C4.1758 11.3411 4.06063 10.673 4.05807 9.99996C4.06218 9.32799 4.1731 8.66075 4.38684 8.02225L4.38115 7.88968L1.19269 5.4624L1.0884 5.51101C0.372763 6.90343 0 8.4408 0 9.99987C0 11.5589 0.372763 13.0963 1.0884 14.4887L4.39899 11.9777Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.2059 3.86663C11.668 3.84438 13.0822 4.37803 14.1515 5.35558L17.0313 2.59996C15.1843 0.901848 12.7383 -0.0298855 10.2059 -3.6784e-05C8.31431 -0.000477834 6.4599 0.514732 4.85001 1.48798C3.24011 2.46124 1.9382 3.85416 1.08984 5.51101L4.38946 8.02225C4.79303 6.82005 5.57145 5.77231 6.61498 5.02675C7.65851 4.28118 8.9145 3.87541 10.2059 3.86663Z"
                  fill="#EB4335"
                />
              </g>
              <defs>
                <clipPath id="clip0_191_13499">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          Sign in with Google
        </button>
      </form>
    </>
  );
}