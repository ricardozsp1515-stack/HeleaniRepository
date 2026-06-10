import AuthHeader from "../components/AuthHeader";
import UserCard from "../components/UserCard";
import PetGallery from "../components/PetGallery";
import AddPetButton from "../components/AddPetButton";
import MobileFrame from "../components/MobileFrame";
import SideMenu from "../components/SideMenu";

export default function Profile() {
    return (
        <div
            data-theme="light"
            className="
                max-w-sm
                mx-auto
                min-h-screen
                bg-[#F5F0E6]
                relative
                overflow-hidden
            "
        >
            <div className="drawer drawer-end h-full">
                
                {/* Control del Drawer */}
                <input
                    id="side-menu"
                    type="checkbox"
                    className="drawer-toggle"
                />

                {/* Contenido principal */}
                <div className="drawer-content min-h-screen bg-[#F5F0E6]">
                    <AuthHeader />

                    <main className="p-8 flex flex-col gap-10 pb-20">
                        <UserCard />

                        <PetGallery />

                        <AddPetButton />
                    </main>

                    <MobileFrame />
                </div>

                {/* Menú lateral */}
                <SideMenu />
            </div>
        </div>
    );
}