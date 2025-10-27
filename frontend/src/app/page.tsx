import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              AI Tools Hub
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-8">
            <span className="text-indigo-700 font-medium text-sm">
              Your Central AI Tools Repository
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Discover, Organize, and
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Master AI Tools
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Streamline your workflow with a comprehensive platform to manage and discover AI tools.
            Organize by categories, control access with roles, and empower your team.
          </p>
          <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-200 text-lg"
            >
              Sign In
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Curated AI Tools</h3>
            <p className="text-gray-600 leading-relaxed">
              Access a comprehensive collection of AI tools organized by categories. Find exactly what you need, when you need it.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Role-Based Access</h3>
            <p className="text-gray-600 leading-relaxed">
              Control who sees what with powerful role management. Perfect for teams with different responsibilities.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Organization</h3>
            <p className="text-gray-600 leading-relaxed">
              Categorize and filter tools by type and purpose. Keep your AI toolkit organized and accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-bold text-gray-900">AI Tools Hub</span>
            </div>
            <p className="text-gray-600 text-sm">
              Built with Next.js & Laravel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
