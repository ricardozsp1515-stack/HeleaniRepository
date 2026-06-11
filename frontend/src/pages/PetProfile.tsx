import AuthenticatedLayout from "../components/layout/AuthLayout";
import PetHeaderCard from "../components/cards/PetHeaderCard";
import OwnerCard from "../components/cards/OwnerCard";
import VetCard from "../components/cards/VetCard";
import PdfCard from "../components/cards/PdfCard";

export default function PetProfile() {
    return (
        <AuthenticatedLayout>

            <main className="p-8 pb-24">

                <PetHeaderCard />

                <div className="mt-8 border border-green-400 rounded-3xl p-4 flex flex-col gap-6 bg-white">

                    {/* Encabezado */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-gray-700">
                            Gato naranja
                        </h2>

                        <button className="btn btn-ghost text-green-800 text-2xl">
                            ✎
                        </button>
                    </div>

                    {/* Datos básicos */}
                    <div className="grid grid-cols-3 gap-2">

                        <div className="border border-green-400 rounded-xl p-2 text-center">
                            <p className="text-sm text-gray-500">Sexo</p>

                            <p className="font-semibold">
                                Hembra
                            </p>
                        </div>

                        <div className="border border-green-400 rounded-xl p-2 text-center">
                            <p className="text-sm text-gray-500">Edad</p>

                            <p className="font-semibold">
                                4 años
                            </p>
                        </div>

                        <div className="border border-green-400 rounded-xl p-2 text-center">
                            <p className="text-sm text-gray-500">Peso</p>

                            <p className="font-semibold">
                                6,31 kg
                            </p>
                        </div>

                    </div>

                    {/* Dueño */}
                    <section>

                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                            Dueño(a)
                        </h3>

                        <OwnerCard />

                    </section>

                    {/* Condiciones */}
                    <section>

                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                            Condiciones especiales
                        </h3>

                        <div className="flex flex-wrap justify-center gap-3">

                            <div className="badge badge-outline badge-lg p-4">
                                Ejemplo_01
                            </div>

                            <div className="badge badge-outline badge-lg p-4">
                                Ejemplo_02
                            </div>

                            <div className="badge badge-outline badge-lg p-4">
                                Ejemplo_03
                            </div>

                            <div className="badge badge-outline badge-lg p-4">
                                Ejemplo_04
                            </div>

                            <div className="badge badge-outline badge-lg p-4">
                                Ejemplo_05
                            </div>

                        </div>

                    </section>

                    {/* Exámenes */}
                    <section>

                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                            Exámenes médicos
                        </h3>

                        <div className="flex flex-col gap-3">

                            <PdfCard fileName="Ejemplo_01.pdf" />

                            <PdfCard fileName="Ejemplo_02.pdf" />

                            <PdfCard fileName="Ejemplo_03.pdf" />

                        </div>

                    </section>

                    {/* Veterinarios */}
                    <section>

                        <h3 className="text-2xl font-bold text-gray-700 mb-3">
                            Registro de veterinarios y clínicas
                        </h3>

                        <div className="flex flex-col gap-3">

                            <VetCard
                                name="Roberto Inge"
                                subtitle="example@gmail.com"
                            />

                            <VetCard
                                name="Veterinaria Center"
                                subtitle="(+506) 0000-0000"
                            />

                        </div>

                    </section>

                </div>

            </main>

        </AuthenticatedLayout>
    );
}