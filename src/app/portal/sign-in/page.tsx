import AuthActions from '@/modules/auth/actions/auth-actions';
import LoginGoogleForm from '@/modules/auth/components/login-google';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden ">
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-96 h-full rounded-full bg-gray-100" />
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-96 h-full rounded-full bg-gray-100" />
            <div className="border border-gray-300 shadow-lg w-96 h-80 p-6  backdrop-blur-sm rounded-[80px] flex flex-col items-center justify-center relative z-10">
                <div className="text-center">
                    <span className="mx-auto mb-4 loader-logo"></span>
                    <div className="text-3xl font-bold mb-10">FullCalendar Project</div>
                    <div className="mb-4">Sign in to access your calendar</div>
                </div>
                <LoginGoogleForm loginGoogle={AuthActions.loginGoogle} />
            </div>
        </div>
    );
}