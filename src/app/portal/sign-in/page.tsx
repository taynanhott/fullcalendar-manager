import AuthActions from '@/modules/auth/actions/auth-actions';
import LoginGoogleForm from '@/modules/auth/components/login-google';

export default function LoginPage() {
    return (
        <main className="min-h-screen">
            <LoginGoogleForm loginGoogle={AuthActions.loginGoogle} />
        </main>
    );
}