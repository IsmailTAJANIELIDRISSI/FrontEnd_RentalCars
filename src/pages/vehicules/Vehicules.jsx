import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  // Select,
  Input,
  option,
  DialogFooter,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { addVehicule, deleteVehicule, getVehicules } from "./vehicules_service";
import AlertCustomCloseIcon from "@/widgets/alerts/Alert";
import { CirclePlus, ImageIcon, Plus } from "lucide-react";
import { acceptPhotoAttribute, allowedPhotoExtensions } from "@/environment";
import { FileInput, Label, Select, TextInput } from "flowbite-react";

export function Vehicules() {
  const [vehicules, setVehicules] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [open, setOpen] = useState(false);
  const [vehicule, setVehicule] = useState({
    matricule: "",
    marque: "",
    nomVehicule: "",
    modele: "",
    typeCarburant: "",
    modeBoite: "",
    puissance: "",
    nbrSiege: "",
    prixLocation: "",
    typeAssurance: "",
    photos: [],
  });
  const [reload, setReload] = useState(false);

  useEffect(() => {
    getAllVehicules();
  }, []);

  const getAllVehicules = () => {
    getVehicules().then((res) => {
      setVehicules(res.data.vehicules);
      setPhotos(res.data.photos);
    });
  };

  const getPhotoByVehicule = (matricule) => {
    console.log(vehicules);
    const photo = photos.find((photo) => photo.matricule === matricule);
    return photo ? photo.photo : null;
  };

  const handleDelete = (matricule) => {
    setSelectedVehicule(matricule);
    setShowModal(true);
  };

  const handleChange = (name, value) => {
    setVehicule({
      ...vehicule,
      [name]: value,
    });
  };

  const handleOpen = () => setOpen(!open);

  const handlePhotoUpload = (e) => {
    const { files } = e.target;
    const validFiles = [];

    Array.from(files).forEach((file) => {
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (allowedPhotoExtensions.includes(fileExtension)) {
        validFiles.push(file);
      } else {
        e.target.value = ""; // Clear the file input
      }
    });

    if (validFiles.length > 0) {
      setPhotos(validFiles);
    }

    // Clear the input value to allow the same file to be uploaded again if needed
    e.target.value = "";
  };

  const confirmDelete = () => {
    if (selectedVehicule) {
      deleteVehicule(selectedVehicule)
        .then((res) => {
          setVehicules((prev) =>
            prev.filter((vehicule) => vehicule.matricule !== selectedVehicule),
          );
          setShowModal(false);
          setSelectedVehicule(null);
          setAlertMessage("Le véhicule a été supprimé avec succès.");
          aaaaa;
          setAlertOpen(true);
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du véhicule:", error);
          setAlertMessage(
            "Désolé, une erreur s'est produite. Veuillez réessayer.",
          );
          setAlertOpen(true);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();

    // Append each property of the vehicule state to the formData object
    formData.append("matricule", vehicule.matricule);
    formData.append("marque", vehicule.marque);
    formData.append("nomVehicule", vehicule.nomVehicule);
    formData.append("modele", vehicule.modele);
    formData.append("typeCarburant", vehicule.typeCarburant);
    formData.append("modeBoite", vehicule.modeBoite);
    formData.append("puissance", vehicule.puissance);
    formData.append("nbrSiege", vehicule.nbrSiege);
    formData.append("prixLocation", vehicule.prixLocation);
    formData.append("typeAssurance", vehicule.typeAssurance);

    // Iterate through the photos array and append each file to the formData object
    photos.forEach((photo) => {
      formData.append("photos[]", photo);
    });

    addVehicule(formData).then((res) => {
      // console.log(res);
    });

    // Log the formData object for debugging
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Perform the form submission logic here
    // Example: send the formData to the backend
    // fetch('/your-backend-endpoint', {
    //   method: 'POST',
    //   body: formData,
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data);
    //   // Handle the response from the backend
    // });

    // Open the modal or perform any other action
    handleOpen();
  };

  return (
    <div className="mb-8 mt-12">
      <AlertCustomCloseIcon
        alertClass={"mb-10"}
        open={alertOpen}
        setOpen={setAlertOpen}
        message={alertMessage}
      />
      <Card className="-mt-50 mx-3 mb-6 border border-blue-gray-100 lg:mx-4">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 flex justify-between p-6"
        >
          <Typography variant="h6" color="white">
            Liste des véhicules
          </Typography>
          <Button
            className="flex items-center gap-2 rounded-full"
            onClick={handleOpen}
            color="blue"
            size="sm"
            variant="gradient"
          >
            <Plus />
            <span>Ajouter un véhicule</span>
          </Button>
        </CardHeader>
        <CardBody className="p-4">
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Vehicles
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
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
                      src={`http://127.0.0.1:8042/storage/files/vehicules/photos/${getPhotoByVehicule(
                        vehicule.matricule,
                      )}`}
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
                    <Link
                      to={`/dashboard/vehicules/${vehicule.matricule}/${false}`}
                    >
                      <Button variant="outlined" size="sm">
                        Voir le véhicule
                      </Button>
                    </Link>
                    <div className="flex space-x-2">
                      <Button
                        variant="outlined"
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(vehicule.matricule)}
                      >
                        Supprimer
                      </Button>
                      <Link
                        to={`/dashboard/vehicules/${
                          vehicule.matricule
                        }/${true}`}
                      >
                        <Button variant="outlined" size="sm" color="blue">
                          Modifier
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modal of add vehicule */}
      <Dialog open={open} size="md" handler={handleOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            Ajouter un véhicule
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5 cursor-pointer"
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <form onSubmit={handleSubmit}>
          <DialogBody className="h-96 overflow-y-auto">
            <div className="">
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="matricule" value="Matricule" />
                </div>
                <TextInput
                  required
                  label="Matricule"
                  name="matricule"
                  placeholder="Matricule"
                  value={vehicule.matricule}
                  onChange={(e) => handleChange("matricule", e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="marque" value="Marque" />
                </div>
                <TextInput
                  required
                  label="Marque"
                  name="marque"
                  placeholder="Marque"
                  value={vehicule.marque}
                  onChange={(e) => handleChange("marque", e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="nomVehicule" value="Nom Véhicule" />
                </div>
                <TextInput
                  required
                  label="Nom Véhicule"
                  name="nomVehicule"
                  placeholder="Nom Véhicule"
                  value={vehicule.nomVehicule}
                  onChange={(e) => handleChange("nomVehicule", e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="modele" value="Modèle" />
                </div>
                <TextInput
                  required
                  label="Modèle"
                  name="modele"
                  placeholder="Modèle"
                  value={vehicule.modele}
                  onChange={(e) => handleChange("modele", e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="typeCarburant" value="Type de carburant" />
                </div>
                <Select
                  // label="Type Carburant"
                  // value={vehicule.typeCarburant}
                  onChange={(e) =>
                    handleChange("typeCarburant", e.target.value)
                  }
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybride">Hybride</option>
                  <option value="electrique">Électrique</option>
                </Select>
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="modeBoite" value="Mode boîte vitesse" />
                </div>
                <Select
                  label="Mode Boîte"
                  // value={vehicule.modeBoite}
                  onChange={(e) => handleChange("modeBoite", e.target.value)}
                >
                  <option value="automatique">Automatique</option>
                  <option value="manuelle">Manuelle</option>
                  <option value="hybride">Hybride</option>
                </Select>
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="puissance" value="Puissance" />
                </div>
                <TextInput
                  required
                  label="Puissance"
                  name="puissance"
                  type="number"
                  placeholder="Puissance"
                  value={vehicule.puissance}
                  onChange={(e) => handleChange("puissance", e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="nbrSiege" value="Nombre de Sièges" />
                </div>
                <TextInput
                  required
                  label="Nombre de Sièges"
                  name="nbrSiege"
                  type="number"
                  placeholder="Nombre de Sièges"
                  value={vehicule.nbrSiege}
                  onChange={(e) => handleChange("nbrSiege", e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="prixLocation" value="Prix de Location" />
                </div>
                <TextInput
                  required
                  label="Prix de Location"
                  name="prixLocation"
                  type="number"
                  placeholder="Prix de Location"
                  value={vehicule.prixLocation}
                  onChange={(e) => handleChange("prixLocation", e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <div className="mb-2 block">
                  <Label htmlFor="typeAssurance" value="Type Assurance" />
                </div>
                <Select
                  // label="Type Assurance"
                  // value={vehicule.typeAssurance}
                  onChange={(e) =>
                    handleChange("typeAssurance", e.target.value)
                  }
                >
                  <option value="RC">RC</option>
                  <option value="tout risque">Tout Risque</option>
                </Select>
              </div>
              <div className="form-group mb-3">
                <div className="">
                  <Label
                    htmlFor="file_input"
                    value="Télécharger plusieurs fichiers"
                  />
                </div>
                <FileInput
                  type="file"
                  multiple
                  onChange={handlePhotoUpload}
                  accept={acceptPhotoAttribute}
                  className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900"
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button variant="text" color="gray" onClick={handleOpen}>
              Annuler
            </Button>
            <Button variant="gradient" color="blue" type="submit">
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
      {/* end modal of add  */}

      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      width="64px"
                      height="64px"
                      className="h-6 w-6 text-red-600"
                      // stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#ef4444"
                      strokeWidth="0.456"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V8C11.25 7.58579 11.5858 7.25 12 7.25Z"
                          fill="#ef4444"
                        ></path>
                        <path
                          d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                          fill="#ef4444"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.2944 4.47643C9.36631 3.11493 10.5018 2.25 12 2.25C13.4981 2.25 14.6336 3.11493 15.7056 4.47643C16.7598 5.81544 17.8769 7.79622 19.3063 10.3305L19.7418 11.1027C20.9234 13.1976 21.8566 14.8523 22.3468 16.1804C22.8353 17.5063 23 18.5274 23 19.25C23 20.937 22.3325 22.3472 21.1756 23.3031C20.0144 24.2623 18.4227 24.75 16.5 24.75H7.5C5.57729 24.75 3.98564 24.2623 2.82445 23.3031C1.66748 22.3472 1 20.937 1 19.25C1 18.5274 1.16469 17.5063 1.6532 16.1804C2.14335 14.8523 3.07664 13.1976 4.25823 11.1027L4.69369 10.3305C6.12312 7.79622 7.24023 5.81544 8.2944 4.47643ZM12 3.75C10.9982 3.75 10.1337 4.38507 9.14779 5.74857C8.0914 7.19456 6.99457 9.13441 5.61154 11.6533L5.17609 12.4254C3.99503 14.52 3.07357 16.0998 2.6532 17.3196C2.23155 18.5405 2.25 19.1726 2.25 19.25C2.25 20.563 2.83252 21.6528 3.57445 22.3031C4.31914 22.9552 5.57729 23.25 7.5 23.25H16.5C18.4227 23.25 19.6809 22.9552 20.4256 22.3031C21.1675 21.6528 21.75 20.563 21.75 19.25C21.75 19.1726 21.7685 18.5405 21.3468 17.3196C20.9264 16.0998 20.005 14.52 18.8239 12.4254L18.3885 11.6533C17.0054 9.13441 15.9086 7.19456 14.8522 5.74857C13.8663 4.38507 13.0018 3.75 12 3.75Z"
                          fill="#ef4444"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-headline"
                    >
                      Supprimer le véhicule
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer ce véhicule? Cette
                        action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <Button
                  variant="danger"
                  onClick={confirmDelete}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Supprimer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vehicules;
