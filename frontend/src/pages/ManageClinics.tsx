import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import AuthenticatedLayout from "../components/layout/AuthLayout";
import AssociatedClinicCard from "../components/cards/AssoClinicCard";
import { getMyCenters } from "../services/centerService";

interface Center {
  id: string;
  name: string;
  contact: string;
  image_url: string;
}

export default function ManageClinics() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCenters()
      .then((data) => setCenters(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthenticatedLayout>
      <main className="p-8 pb-24 flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-gray-700 text-center">
          Administrar clínicas
        </h1>

        {loading && (
          <p className="text-center text-gray-600">Cargando...</p>
        )}

        {!loading && centers.length === 0 && (
          <p className="text-center text-gray-600">
            Todavía no administras ninguna clínica.
          </p>
        )}

        {!loading && centers.length > 0 && (
          <div className="flex flex-col gap-3">
            {centers.map((center) => (
              <Link key={center.id} to={`/clinic-profile/${center.id}`}>
                <AssociatedClinicCard
                  name={center.name}
                  phone={center.contact}
                  imageUrl={center.image_url}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </AuthenticatedLayout>
  );
}