import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVehicules } from "./vehicules_service";
import axios from "axios";

export function Vehicules() {
  const [vehicules, setVehicules] = useState([]);

  useEffect(() => {
    getAllVehicules();
  }, []);

  const getAllVehicules = () => {
    getVehicules().then((res) => {
      setVehicules(res.data.vehicules);
    });
  };

  const handleDelete = (matricule) => {
    axios
      .delete(`/api/vehicules/${matricule}`)
      .then(() => {
        setVehicules((prev) =>
          prev.filter((vehicule) => vehicule.matricule !== matricule),
        );
      })
      .catch((error) => console.error("Error deleting vehicule:", error));
  };

  return (
    <div className="mb-8 mt-12">
      <Card className="-mt-50 mx-3 mb-6 border border-blue-gray-100 lg:mx-4">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Liste des véhicules
          </Typography>
        </CardHeader>
        <CardBody className="p-4">
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Vehicles
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {vehicules.map((vehicule) => (
                <Card
                  key={vehicule.matricule}
                  color="transparent"
                  shadow={false}
                >
                  <CardHeader
                    floated={false}
                    color="gray"
                    className="mx-0 mb-4 mt-0 h-64 xl:h-40"
                  >
                    <img
                      src="/img/team-4.jpeg" // Ensure you set the correct image path
                      alt={vehicule.modele}
                      className="h-full w-full object-cover"
                    />
                  </CardHeader>
                  <CardBody className="px-1 py-0">
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-500"
                    >
                      {vehicule.marque}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="blue-gray"
                      className="mb-2 mt-1"
                    >
                      {vehicule.modele}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-500"
                    >
                      {vehicule.type}
                    </Typography>
                  </CardBody>
                  <CardFooter className="mt-6 flex items-center justify-between px-1 py-0">
                    <Link to={`/dashboard/vehicules/${vehicule.matricule}`}>
                      <Button variant="outlined" size="sm">
                        View Vehicle
                      </Button>
                    </Link>
                    <div className="flex space-x-2">
                      <Button
                        variant="outlined"
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(vehicule.matricule)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outlined"
                        size="sm"
                        color="blue"
                        onClick={() =>
                          navigate(`/vehicules/edit/${vehicule.matricule}`)
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Vehicules;
