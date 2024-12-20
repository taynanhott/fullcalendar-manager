import AuthActions from '@/modules/auth/actions/auth-actions';
import LoginGoogleForm from '@/modules/auth/components/login-google';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white overflow-hidden h-screen">
            <div className="relative w-10/12 md:w-96 lg:w-96">
                {/* Decorative circles */}
                <div className="absolute -top-40 -left-40 w-72 h-72 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-50 overflow-x-hidden animate-float-slow" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-300 via-emerald-500 to-green-500 rounded-full opacity-50 overflow-x-hidden animate-float-fast" />
                <div className="absolute top-40 -left-[550px] w-64 h-64 bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 rounded-full opacity-50 animate-float-fast-inverse" />
                <div className="absolute -top-96 left-96 w-64 h-64 bg-gradient-to-r from-amber-300 via-yellow-500 to-orange-500 rounded-full opacity-50 animate-float-fast-inverse" />
                <div className="absolute top-72 left-[750px] w-96 h-96 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-full opacity-50 animate-float-slow" />
                <div className="absolute -top-[500px] -left-[600px] w-96 h-96 bg-gradient-to-r from-indigo-800 via-blue-500 to-blue-300 rounded-full opacity-50 animate-float-slow-inverse" />


                {/* Login card */}
                <div className="relative p-8 rounded-lg shadow-lg border-transparent border-2 backdrop-blur-md">
                    <span className="loader-logo block mx-auto mb-4"></span>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">FullCalendar</h2>

                    <p className="mt-6 text-center text-sm text-gray-600 mb-4">
                        Sign in to access your calendar.
                    </p>

                    <LoginGoogleForm loginGoogle={AuthActions.loginGoogle} />
                </div>
            </div>
        </div>

    );
}