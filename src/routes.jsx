import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Vehicules from "./pages/vehicules/Vehicules";
import VehiculeDetail from "./pages/vehicules/VehiculeDetail";
import Garages from "./pages/garages/Garages";
import Reclamations from "./pages/reclamations/Reclamations";
import Clients from "./pages/clients/Clients";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Véhicules",
        path: "/vehicules",
        element: <Vehicules />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Locations",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Réclamations",
        path: "/reclamations",
        element: <Reclamations />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Clients",
        path: "/Clients",
        element: <Clients />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Garages",
        path: "/garages",
        element: <Garages />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "vehiculeById",
      //   path: "/vehicules/:matricule",
      //   element: <VehiculeDetail />,
      // },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
