import { Link } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import RegisterInput from "../components/forms/RegisterInput";
import VerificationUpload from "../components/forms/VerificationUpload";

export default function VetVerification() {
    return (
        <AuthLayout>

            <main className="p-8 pb-24 flex flex-col gap-6">

                <h1 className="text-center text-3xl font-bold text-gray-700">
                    Solicitar afiliación veterinaria
                </h1>

                <div className="bg-white rounded-3xl p-5 flex flex-col gap-5">

                    <RegisterInput
                        placeholder="Número de colegiado..."
                    />

                    <RegisterInput
                        placeholder="Universidad..."
                    />

                    <RegisterInput
                        placeholder="Años de experiencia..."
                    />

                    <VerificationUpload
                        title="Título universitario"
                    />

                    <VerificationUpload
                        title="Carnet profesional"
                    />

                    <Link
                        to="/profile"
                        className="
                            btn
                            bg-green-800
                            border-none
                            text-white!
                            rounded-xl
                        "
                    >
                        Enviar solicitud
                    </Link>

                </div>

            </main>

        </AuthLayout>
    );
}