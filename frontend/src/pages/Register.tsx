import Header from "../components/Header";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <div
      data-theme="light"
      className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
    >
      <Header />
      <RegisterForm />
    </div>
  );
}
