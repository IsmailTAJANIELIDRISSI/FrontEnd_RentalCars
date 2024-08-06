import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  Dialog,
  Button,
  DialogHeader,
  DialogBody,
  Input,
  DialogFooter,
} from "@material-tailwind/react";
// import { Button as button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { getVehicules, addVehicule, deleteVehicule } from "./vehicules_service";
import AlertCustomCloseIcon from "@/widgets/alerts/Alert";
import { Plus } from "lucide-react";
import {
  Button as ButtonFlow,
  FileInput,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { acceptPhotoAttribute, allowedPhotoExtensions } from "@/environment";

const Vehicules = () => {
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
    typeCarburant: "diesel",
    modeBoite: "manuelle",
    puissance: "",
    nbrSiege: "",
    prixLocation: "",
    typeAssurance: "RC",
    photos: [],
  });
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVehicules();
        setVehicules(res.data.vehicules);
        setPhotos(res.data.photos);
      } catch (error) {
        console.error("Error fetching vehicules:", error);
      }
    };

    fetchData();
  }, []);

  const getPhotoByVehicule = useCallback(
    (matricule) => {
      const photo = photos.find((photo) => photo.matricule === matricule);
      return photo ? photo.photo : null;
    },
    [photos],
  );

  const handleDelete = (matricule) => {
    setSelectedVehicule(matricule);
    // setOpenModalError(true);
    setShowModal(true);
  };

  const handleChange = (name, value) => {
    setVehicule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpen = () => setOpen(!open);

  const handlePhotoUpload = (e) => {
    const { files } = e.target;
    const validFiles = Array.from(files).filter((file) =>
      allowedPhotoExtensions.includes(
        file.name.substring(file.name.lastIndexOf(".")).toLowerCase(),
      ),
    );

    setVehicule({ ...vehicule, photos: validFiles });
    // e.target.value = "";
    // console.log(validFiles);
  };

  const confirmDelete = async () => {
    if (selectedVehicule) {
      try {
        await deleteVehicule(selectedVehicule);
        setVehicules((prev) =>
          prev.filter((vehicule) => vehicule.matricule !== selectedVehicule),
        );
        setShowModal(false);
        setSelectedVehicule(null);
        setSuccessMessage("Le véhicule a été supprimé avec succès.");
        setOpenModalSuccess(true);
      } catch (error) {
        setShowModal(false);
        console.error("Erreur lors de la suppression du véhicule:", error);
        setErrorMessage(
          "Désolé, une erreur s'est produite. Veuillez réessayer.",
        );
        // setAlertOpen(true);
        setOpenModalError(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(vehicule.photos);

    const formData = new FormData();
    Object.keys(vehicule).forEach((key) => {
      if (key === "photos") {
        vehicule.photos.forEach((photo) => {
          formData.append("photos[]", photo);
        });
      } else {
        formData.append(key, vehicule[key]);
      }
    });
    console.log(formData);
    try {
      await addVehicule(formData);
      setSuccessMessage("Véhicule ajouté avec succès !");
      setOpenModalSuccess(true);
      // setReload(!reload);
      setVehicule({
        matricule: "",
        marque: "",
        nomVehicule: "",
        modele: "",
        typeCarburant: "diesel",
        modeBoite: "manuelle",
        puissance: "",
        nbrSiege: "",
        prixLocation: "",
        typeAssurance: "RC",
        photos: [],
      });
    } catch (err) {
      setErrorMessage("Une erreur s'est produite lors de l'ajout du véhicule.");
      setOpenModalError(true);
      console.error(err);
    }
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
                      <ButtonFlow variant="outlined" size="sm" outline pill>
                        Voir le véhicule
                      </ButtonFlow>
                    </Link>
                    <div className="flex space-x-2">
                      <ButtonFlow
                        pill
                        variant="outlined"
                        size="sm"
                        outline
                        color="failure"
                        onClick={() => handleDelete(vehicule.matricule)}
                      >
                        Supprimer
                      </ButtonFlow>
                      <Link
                        to={`/dashboard/vehicules/${
                          vehicule.matricule
                        }/${true}`}
                      >
                        <ButtonFlow
                          outline
                          variant="outlined"
                          size="sm"
                          color="warning"
                          pill
                        >
                          Modifier
                        </ButtonFlow>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <Dialog open={open} size="md" handler={handleOpen}>
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
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
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <DialogBody divider className="h-[25rem] overflow-scroll">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextInput
                  required
                  // size="lg"
                  placeholder="Entrez le matricule"
                  value={vehicule.matricule}
                  onChange={(e) => handleChange("matricule", e.target.value)}
                />
                <TextInput
                  required
                  // size="lg"
                  placeholder="Entrez la marque"
                  value={vehicule.marque}
                  onChange={(e) => handleChange("marque", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextInput
                  required
                  // size="lg"
                  label="Nom"
                  placeholder="Entrez le nom du véhicule"
                  value={vehicule.nomVehicule}
                  onChange={(e) => handleChange("nomVehicule", e.target.value)}
                />
                <TextInput
                  required
                  // size="lg"
                  placeholder="Entrez le modèle"
                  value={vehicule.modele}
                  onChange={(e) => handleChange("modele", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Select
                  id="typeCarburant"
                  value={vehicule.typeCarburant}
                  onChange={(e) =>
                    handleChange("typeCarburant", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Sélectionner le type de carburant
                  </option>
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="electrique">Electrique</option>
                </Select>
                <Select
                  id="modeBoite"
                  value={vehicule.modeBoite}
                  onChange={(e) => handleChange("modeBoite", e.target.value)}
                >
                  <option value="" disabled>
                    Sélectionner le mode de boîte
                  </option>
                  <option value="automatique">Automatique</option>
                  <option value="manuelle">Manuelle</option>
                  <option value="hybride">Hybride</option>
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextInput
                  required
                  // size="lg"
                  type="number"
                  placeholder="Entrez la puissance"
                  value={vehicule.puissance}
                  onChange={(e) => handleChange("puissance", e.target.value)}
                />
                <TextInput
                  required
                  // size="lg"
                  type="number"
                  placeholder="Entrez le nombre de sièges"
                  value={vehicule.nbrSiege}
                  onChange={(e) => handleChange("nbrSiege", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextInput
                  required
                  // size="lg"
                  type="number"
                  placeholder="Entrez le prix de location"
                  value={vehicule.prixLocation}
                  onChange={(e) => handleChange("prixLocation", e.target.value)}
                />
                <Select
                  id="typeAssurance"
                  value={vehicule.typeAssurance}
                  onChange={(e) =>
                    handleChange("typeAssurance", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Sélectionner le type d'assurance
                  </option>
                  <option value="RC">RC</option>
                  <option value="tout risque">Tous risques</option>
                </Select>
              </div>
              <div className="">
                <Label
                  htmlFor="fileInput"
                  value="Télécharger plusieurs images"
                />
                <FileInput
                  required
                  id="fileInput"
                  accept={acceptPhotoAttribute}
                  multiple
                  onChange={handlePhotoUpload}
                  placeholder="Téléchargez de nouvelles photos
"
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <ButtonFlow
              pill
              // variant="outlined"
              color="light"
              // variant="gradient"
              onClick={handleOpen}
            >
              Cancel
            </ButtonFlow>
            <ButtonFlow
              pill
              variant="gradient"
              color="blue"
              type="submit"
              // onClick={handleSubmit}
            >
              Ajouter
            </ButtonFlow>
          </DialogFooter>
        </form>
      </Dialog>

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

      {/* <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <HiCheckCircle className="mr-1 h-5 w-5 text-red-500" />
          <span>Confirmation de suppression</span>
        </Modal.Header>
        <Modal.Body>
          <p>Voulez-vous vraiment supprimer ce véhicule ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} color="gray">
            Annuler
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal> */}

      {/* <Modal show={openModalSuccess} onClose={() => setOpenModalSuccess(false)}>
        <Modal.Body>
          <HiCheckCircle className="mr-1 h-5 w-5 text-green-500" />
          <span>Véhicule ajouté avec succès !</span>
        </Modal.Body>
      </Modal> */}

      {/* success message of actions if add or delete */}
      <Modal
        show={openModalSuccess}
        size="md"
        onClose={() => setOpenModalSuccess(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500 dark:text-green-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {/* Véhicule ajouté avec succès ! */}
              {successMessage}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="green" onClick={() => setOpenModalSuccess(false)}>
                Ok
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* <SuccessModal
        openModal={openModalSuccess}
        message="Véhicule ajouté avec succès !"
      /> */}
      {/* END CONFIRMATION MESSAGE SUCCES MODAL */}

      {/* Erreur modal */}
      <Modal
        show={openModalError}
        size="md"
        onClose={() => setOpenModalError(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiXCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {/* Une erreur s'est produite lors de l'ajout du véhicule. */}
              {errorMessage}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => setOpenModalError(false)}>
                Ok
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* End errur modal */}
    </div>
  );
};

export default Vehicules;
