import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-700">JobPortal<span className="text-gray-900">Pro</span></div>
        <div className="space-x-6 text-gray-600 font-medium">
          <Link href="#help" className="hover:text-blue-600 transition">Help</Link>
          <Link href="#contact" className="hover:text-blue-600 transition">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-6 py-12 flex flex-col md:flex-row items-center">
        {/* Welcome Text */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Connecting Talent with <br /> 
            <span className="text-blue-600">Global Opportunity.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Welcome to the next generation of career management. Whether you are a seeker chasing your 
            dream role or a company building a world-class team, our portal provides the precision 
            tools you need to succeed.
          </p>
          
          <Link href="/dashboard/dashboard">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1">
              Access Dashboard & Login
            </button>
          </Link>
        </div>

        {/* Picture Box for Employees */}
        <div className="md:w-1/2 w-full">
          <div className="relative h-96 w-full bg-gray-200 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            {/* Placeholder for Employee Search Image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-gray-900/40">
               <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1000" 
                alt="Employees searching for jobs" 
                className="object-cover w-full h-full opacity-90"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 p-4 rounded-lg backdrop-blur-sm">
                <p className="text-blue-800 font-bold uppercase text-xs tracking-widest">Employee Spotlight</p>
                <p className="text-gray-800 font-medium">"Found my dream role in 2 weeks!"</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info / Contact */}
      <footer className="bg-white border-t py-10" id="contact">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Support: support@jobportal.com<br />
              Dhaka Office: +880 1234 567 890
            </p>
          </div>
          <div id="help">
            <h3 className="font-bold text-gray-900 mb-3">Help Center</h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li><Link href="#" className="hover:underline">FAQs for Seekers</Link></li>
              <li><Link href="#" className="hover:underline">Employer Guidelines</Link></li>
            </ul>
          </div>
          <div className="text-right flex flex-col justify-end">
            <p className="text-gray-400 text-xs">© 2026 JobPortal System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;