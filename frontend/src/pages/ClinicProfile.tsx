import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import VetCard from "../components/cards/VetCard";

export default function ClinicProfile() {

    const [message, setMessage] = useState("");

    return (
        <AuthLayout>

            <main className="p-8 pb-24 flex flex-col gap-6">

                {/* Header */}
                <div className="bg-white rounded-3xl p-4">

                    <img
                        src="https://images.unsplash.com/photo-1771304873117-7509c5521e1a"
                        alt="Clínica Veterinaria"
                        className="
                            w-full
                            h-64
                            object-cover
                            rounded-2xl
                        "
                    />

                    <div className="mt-4">

                        <h1 className="text-4xl font-bold text-gray-700">
                            Veterinaria center
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Lorem ipsum dolor sit amet consectetur.
                            Nibh magna nisl ullamcorper eget etiam eget sit malesuada.
                            Proin facilisis ac lorem id morbi elit...
                        </p>

                    </div>

                </div>

                {/* Información */}
                <div className="bg-white rounded-3xl p-4 flex flex-col gap-6">

                    <section>

                        <h2 className="text-3xl font-bold text-gray-700">
                            Clínica afiliada
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Nivel de recomendación: Muy alto.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-3xl font-bold text-gray-700">
                            Número registrado
                        </h2>

                        <p className="text-gray-600 mt-2">
                            (+506) 0000-0000
                        </p>

                    </section>

                    <section>

                        <h2 className="text-3xl font-bold text-gray-700 mb-4">
                            Veterinarios asociados
                        </h2>

                        <Link to="/vet-profile">

                            <VetCard
                                name="Roberto Inge"
                                subtitle="(+506) 0000-0000"
                            />

                        </Link>

                    </section>

                    {/* Recomendación */}
                    <section>

                        <h2 className="text-3xl font-bold text-gray-700 mb-4">
                            ¿Recomienda este perfil?
                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setMessage("Perfil recomendado")
                                }
                                className="
                                    btn
                                    bg-green-600
                                    hover:bg-green-700
                                    border-none
                                    text-white
                                "
                            >
                                SI
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setMessage("Perfil no recomendado")
                                }
                                className="
                                    btn
                                    btn-outline
                                    border-green-600
                                    text-green-700
                                "
                            >
                                NO
                            </button>

                        </div>

                        {message && (

                            <div className="mt-4 text-center">

                                <span
                                    className="
                                        bg-green-700
                                        text-white
                                        px-4
                                        py-2
                                        rounded
                                    "
                                >
                                    {message}
                                </span>

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </AuthLayout>
    );
}