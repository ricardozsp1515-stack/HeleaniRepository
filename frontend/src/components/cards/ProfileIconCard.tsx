import { Link } from "react-router-dom";

interface ProfileIconCardProps {
  to: string;
  name: string;
  imageUrl: string;
}

// Ícono circular con el nombre debajo, pensado para vivir dentro de un
// CarouselSection. Todo el elemento es clickeable y lleva al perfil
// correspondiente (vet-profile, clinic-profile, etc. según la ruta que
// reciba en `to`).
export default function ProfileIconCard({
  to,
  name,
  imageUrl,
}: ProfileIconCardProps) {
  return (
    <Link
      to={to}
      className="
        flex
        flex-col
        items-center
        gap-2
        w-20
        shrink-0
        snap-start
        text-center
      "
    >
      <div className="avatar">
        <div className="w-16 rounded-full ring ring-green-200">
          <img src={imageUrl} alt={name} className="object-cover" />
        </div>
      </div>

      <span className="text-xs font-medium text-gray-700 line-clamp-2">
        {name}
      </span>
    </Link>
  );
}