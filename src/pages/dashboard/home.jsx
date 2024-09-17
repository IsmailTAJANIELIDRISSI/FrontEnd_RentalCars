import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
} from "@material-tailwind/react";
import { Avatar as AvatarFlow } from "flowbite-react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { TbCalendarDollar } from "react-icons/tb";
import { FaCar, FaUsers } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { chartsConfig } from "@/configs";
import { locationApi } from "@/environment";
import { getTopVehicules } from "./statistiques_service";
import ModalMessage from "@/widgets/modals/ModalMessage";
import Loading from "@/widgets/loading/Loading";
import { CheckCircleIcon, ClockIcon } from "lucide-react";

export function Home() {
  const [statisticsCardsData, setStatisticsCardsData] = useState([]);
  const [statisticsChartsData, setStatisticsChartsData] = useState([]);
  const [year, setYear] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading
  const [modalMessage, setModalMessage] = useState({
    show: false,
    message: "",
    isSuccess: true,
  }); // State for modal

  useEffect(() => {
    fetchStatisticsData();
    fetchReservationsData();
    getAllTopVehicules();
  }, []);

  const token = JSON.parse(localStorage.getItem("token"));
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  };

  const fetchStatisticsData = async () => {
    setLoading(true); // Show loading
    try {
      const responses = await Promise.all([
        locationApi.get("/statistics/monthly-revenue", { headers }),
        locationApi.get("/statistics/today-reservations", { headers }),
        locationApi.get("/statistics/total-clients", { headers }),
        locationApi.get("/statistics/total-vehicles", { headers }),
      ]);

      const [monthlyRevenue, todayReservations, totalClients, totalVehicles] =
        responses.map((res) => res.data);

      setStatisticsCardsData([
        { ...monthlyRevenue, icon: TbCalendarDollar },
        { ...todayReservations, icon: FaCalendarCheck },
        { ...totalClients, icon: FaUsers },
        { ...totalVehicles, icon: FaCar },
      ]);
    } catch (error) {
      console.error("Failed to fetch statistics data:", error);
      setModalMessage({
        show: true,
        message: "Erreur lors de la récupération des statistiques.",
        isSuccess: false,
      });
    } finally {
      setLoading(false); // Hide loading
    }
  };

  const fetchReservationsData = async (month = null) => {
    setLoading(true); // Show loading
    try {
      const response = await locationApi.get(
        `/statistics/monthly-reservations`,
        {
          params: {
            year,
          },
          headers,
        },
      );

      const dataF = response.data;

      const reservationsByMonth = {
        type: "line",
        height: 250,
        series: [
          {
            name: "Sales",
            data: dataF.map(({ total }) => total),
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#0288d1"],
          stroke: {
            lineCap: "round",
          },
          markers: {
            size: 5,
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: dataF.map(({ month }) => month),
          },
        },
      };

      const rpm = {
        color: "white",
        title: "Réservations par mois",
        description: "Total resérvation de chaque mois",
        footer: "updated 4 min ago",
        chart: reservationsByMonth,
      };

      const { data } = await locationApi.get("/statistics/reservations", {
        params: { month, year },
        headers,
      });

      const reservationsChart = {
        type: "bar",
        height: 250,
        series: [
          {
            name: "Reservations",
            data: data.counts,
          },
        ],
        options: {
          ...chartsConfig,
          colors: "#388e3c",
          plotOptions: {
            bar: {
              columnWidth: "16%",
              borderRadius: 5,
            },
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: data.days,
          },
        },
      };

      const rpj = {
        color: "white",
        title: "Reservations par jour",
        description: "Réservations du mois",
        footer: "Mise à jour récente",
        chart: reservationsChart,
      };

      setStatisticsChartsData([rpj, rpm]);
    } catch (error) {
      console.error("Failed to fetch reservations data:", error);
      setModalMessage({
        show: true,
        message: "Erreur lors de la récupération des réservations.",
        isSuccess: false,
      });
    } finally {
      setLoading(false); // Hide loading
    }
  };

  const getAllTopVehicules = () => {
    setLoading(true); // Show loading
    getTopVehicules()
      .then((res) => {
        setVehicules(res.data);
      })
      .catch((error) => {
        console.error("Failed to fetch top vehicles:", error);
        setModalMessage({
          show: true,
          message:
            "Erreur lors de la récupération des véhicules les plus réservés.",
          isSuccess: false,
        });
      })
      .finally(() => {
        setLoading(false); // Hide loading
      });
  };

  return (
    <div className="mt-12">
      {loading && <Loading />} {/* Display loading indicator */}
      <div className="mb-12 grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }, index) => (
          <StatisticsCard
            key={index}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-2">
        {statisticsChartsData.map((props, index) => (
          <StatisticsChart
            key={index}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-1">
        <Card className="overflow-hidden border border-blue-gray-100 shadow-sm xl:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Véhicules les plus réservés
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon
                  strokeWidth={3}
                  className="h-4 w-4 text-blue-gray-200"
                />
                <strong>{vehicules.length} véhicules</strong> listés
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pb-2 pt-0">
            {loading ? (
              <Loading />
            ) : vehicules.length === 0 ? (
              <div className="flex justify-center py-10">
                <Typography variant="h6" color="blue-gray">
                  Aucun véhicule disponible pour le moment.
                </Typography>
              </div>
            ) : (
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      "Véhicule",
                      "Clients",
                      "Prix de location",
                      "Chiffre d'affaire",
                    ].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 px-6 py-3 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicules.map(
                    (
                      {
                        matricule,
                        name,
                        photo,
                        clients,
                        prixLocation,
                        revenue,
                      },
                      key,
                    ) => {
                      const className = `py-3 px-5 ${
                        key === vehicules?.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={key}>
                          {/* Vehicle Photo and Name */}
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar
                                src={`http://127.0.0.1:8042/storage/files/vehicules/photos/${photo}`}
                                alt={name}
                                size="sm"
                              />
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {name}
                              </Typography>
                            </div>
                          </td>

                          {/* Clients */}
                          <td className={className}>
                            <AvatarFlow.Group>
                              {clients
                                .slice(0, 2)
                                .map(({ photo, name }, key) => (
                                  <Tooltip key={key} content={name}>
                                    <div
                                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-xs font-bold uppercase text-white ${
                                        key === 0 ? "" : "-ml-2.5"
                                      }`}
                                    >
                                      {name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                  </Tooltip>
                                ))}
                              {clients.length > 2 && (
                                <div className="-ml-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
                                  +{clients.length - 2}
                                </div>
                              )}
                            </AvatarFlow.Group>
                          </td>

                          {/* Total Amount */}
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
                              {prixLocation.toFixed(2)} DH
                            </Typography>
                          </td>

                          {/* Revenue */}
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-xs font-medium text-blue-gray-600"
                            >
                              {revenue.toFixed(2)} DH
                            </Typography>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
      {/* ModalMessage Component */}
      {modalMessage.show && (
        <ModalMessage
          isSuccess={modalMessage.isSuccess}
          message={modalMessage.message}
          onClose={() => setModalMessage({ ...modalMessage, show: false })}
        />
      )}
    </div>
  );
}

export default Home;
