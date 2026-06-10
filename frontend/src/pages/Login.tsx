import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import MobileFrame from "../components/MobileFrame";

export default function Login() {
    return (
        <div
            data-theme="light"
            className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
        >
            <Header />
            <LoginForm />
            <MobileFrame />
        </div>
    );
}