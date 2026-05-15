import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="flex flex-col min-h-screen bg-mint/50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-primary/10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-1.196-8.836a12.057 12.057 0 013.383-3.192m1.196 8.836c.417 1.166.637 2.422.637 3.726M12 11V7m0 4v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-dark">Welcome Back</h1>
              <p className="text-secondary-text text-sm mt-2">Sign in using your Bhutan NDI or organization credentials.</p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary-text uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="admin@organization.bt" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary-text uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50/50"
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 text-sm text-secondary-text cursor-pointer">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary/20" />
                  Remember me
                </label>
                <Link href="#" className="text-sm font-semibold text-primary hover:underline">Forgot password?</Link>
              </div>

              <div className="space-y-3 pt-4">
                <Link href="/dashboard/agency" className="block">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                  <span className="w-4 h-4 bg-primary rounded-sm"></span>
                  Login with Bhutan NDI
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-sm text-secondary-text">
                Don't have an account? <Link href="#" className="font-bold text-primary hover:underline">Register your organization</Link>
              </p>
            </div>
          </Card>
          
          <p className="text-center text-xs text-secondary-text mt-8 px-6">
            By signing in, you agree to the Bhutan Procurement Transparency Platform's Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  );
}
