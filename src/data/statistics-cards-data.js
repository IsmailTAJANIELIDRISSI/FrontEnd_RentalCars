import {
  // BanknotesIcon,
  UserPlusIcon,
  // UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

import { TbCalendarDollar } from "react-icons/tb";
import { FaCar, FaUsers } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: TbCalendarDollar,
    title: "Chiffre d'affaires mensuelle",
    value: "$53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "par rapport au mois dernier",
    },
  },
  {
    color: "gray",
    icon: FaCalendarCheck,
    title: "Vehicule réservé aujourd'hui",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "par rapport au mois dernier",
    },
  },
  {
    color: "gray",
    icon: FaUsers,
    title: "Total clients",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "par rapport à hier",
    },
  },
  {
    color: "gray",
    icon: FaCar,
    title: "Total véhicules",
    value: "$103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "par rapport à hier",
    },
  },
];

export default statisticsCardsData;
