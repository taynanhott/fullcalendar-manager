import AuthActions from '@/modules/auth/actions/auth-actions';
import LoginGoogleForm from '@/modules/auth/components/login-google';

export default function LoginPage() {
    return (
        
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden ">
                <LoginGoogleForm loginGoogle={AuthActions.loginGoogle} />
        </div>
    );
}