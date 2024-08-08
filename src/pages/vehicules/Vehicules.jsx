import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { getVehicules, addVehicule, deleteVehicule } from "./vehicules_service";
import { Plus } from "lucide-react";
import {
  // Button,
  Button as ButtonFlow,
  FileInput,
  Label,
  Modal,
  Select,
  TextInput,
} from "flowbite-react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

import { acceptPhotoAttribute, allowedPhotoExtensions } from "@/environment";
import ModalMessage from "@/widgets/modals/ModalMessage";
import ConfirmationModal from "@/widgets/modals/ConfirmationModal";

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
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

  useEffect(() => {
    // Fetch vehicles from your backend
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getVehicules();
      setVehicules(res.data.vehicules);
      setPhotos(res.data.photos);
    } catch (error) {
      console.error("Error fetching vehicules:", error);
    }
  };

  const getPhotoByVehicule = useCallback(
    (matricule) => {
      const photo = photos.find((photo) => photo.matricule === matricule);
      return photo ? photo.photo : null;
    },
    [photos],
  );

  const handleDelete = (matricule) => {
    setSelectedVehicule(matricule);
    setShowModal(true);
  };

  const handleChange = (name, value) => {
    setVehicule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const { files } = e.target;
    const validFiles = Array.from(files).filter((file) =>
      allowedPhotoExtensions.includes(
        file.name.substring(file.name.lastIndexOf(".")).toLowerCase(),
      ),
    );

    setVehicule({ ...vehicule, photos: validFiles });
  };

  const handleOpen = () => setOpen(!open);

  const confirmDelete = async () => {
    if (selectedVehicule) {
      try {
        await deleteVehicule(selectedVehicule);
        setVehicules((prev) =>
          prev.filter((vehicule) => vehicule.matricule !== selectedVehicule),
        );
        setSelectedVehicule(null);
        setSuccessMessage("Véhicule supprimé avec succès !");
        setOpenModalSuccess(true);
      } catch (error) {
        console.error("Erreur lors de la suppression du véhicule:", error);
        setErrorMessage(
          "Désolé, une erreur s'est produite lors de la suppression du véhicule. Veuillez réessayer.",
        );
        setIsSuccess(false);
        setOpenModalError(true);
      } finally {
        setShowModal(false);
      }
    }
  };

  const handleSubmit = async () => {
    // Validate if all required fields are not empty
    const requiredFields = [
      "matricule",
      "marque",
      "nomVehicule",
      "modele",
      "puissance",
      "nbrSiege",
      "prixLocation",
    ];

    const isValid = requiredFields.every(
      (field) => vehicule[field].trim() !== "",
    );

    // Check if photos are not empty
    const arePhotosValid = vehicule.photos.length > 0;

    if (!isValid || !arePhotosValid) {
      // Show error message if validation fails
      setIsSuccess(false);
      setErrorMessage(
        "Veuillez remplir tous les champs et ajouter au moins une photo.",
      );
      setOpenModalError(true);
      return;
    }

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

    try {
      await addVehicule(formData);
      setSuccessMessage("Véhicule ajouté avec succès !");
      setOpenModalSuccess(true);
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
      <Card className="-mt-50 mx-3 mb-6 border border-blue-gray-100 lg:mx-4">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 flex justify-between p-6"
        >
          <Typography variant="h6" color="white">
            Liste des véhicules
          </Typography>
          <ButtonFlow
            gradientDuoTone="purpleToBlue"
            className="rounded-full"
            onClick={handleOpen}
            // color="blue"
            size="sm"
            // variant="gradient"
          >
            <Plus className="mr-2 h-5 w-5" />
            <span>Ajouter un véhicule</span>
          </ButtonFlow>
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
                      {vehicule.modeBoite}
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

      {/* Modal for Adding or Editing Vehicle */}
      <Modal
        show={open}
        onClose={() => {
          setOpen(false);
        }}
        size="2xl"
        popup
      >
        <Modal.Header className="p-3">Ajouter un véhicule</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white"></h3> */}

            <div>
              <Label htmlFor="matricule" value="Matricule" />
              <TextInput
                id="matricule"
                value={vehicule.matricule}
                onChange={(e) => handleChange("matricule", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="marque" value="Marque" />
              <TextInput
                id="marque"
                value={vehicule.marque}
                onChange={(e) => handleChange("marque", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="nomVehicule" value="Nom du véhicule" />
              <TextInput
                id="nomVehicule"
                value={vehicule.nomVehicule}
                onChange={(e) => handleChange("nomVehicule", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="modele" value="Modèle" />
              <TextInput
                id="modele"
                value={vehicule.modele}
                onChange={(e) => handleChange("modele", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="typeCarburant" value="Type de carburant" />
              <Select
                id="typeCarburant"
                value={vehicule.typeCarburant}
                onChange={(e) => handleChange("typeCarburant", e.target.value)}
              >
                <option value="diesel">Diesel</option>
                <option value="essence">Essence</option>
                <option value="electrique">Electrique</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="modeBoite" value="Mode de boîte" />
              <Select
                id="modeBoite"
                value={vehicule.modeBoite}
                onChange={(e) => handleChange("modeBoite", e.target.value)}
              >
                <option value="manuelle">Manuelle</option>
                <option value="automatique">Automatique</option>
                <option value="hybride">Hybride</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="puissance" value="Puissance" />
              <TextInput
                id="puissance"
                value={vehicule.puissance}
                type="number"
                onChange={(e) => handleChange("puissance", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nbrSiege" value="Nombre de sièges" />
              <TextInput
                id="nbrSiege"
                value={vehicule.nbrSiege}
                type="number"
                onChange={(e) => handleChange("nbrSiege", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="prixLocation" value="Prix de location" />
              <TextInput
                id="prixLocation"
                type="number"
                value={vehicule.prixLocation}
                onChange={(e) => handleChange("prixLocation", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="typeAssurance" value="Type d'assurance" />
              <Select
                id="typeAssurance"
                value={vehicule.typeAssurance}
                onChange={(e) => handleChange("typeAssurance", e.target.value)}
              >
                <option value="RC">Responsabilité Civile</option>
                <option value="tout risque">Tous risques</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="photos" value="Photos" />
              <FileInput
                id="photos"
                accept={acceptPhotoAttribute}
                multiple
                onChange={handlePhotoUpload}
              />
            </div>
            {/* <ButtonFlow type="submit" color="blue" size="md">
              {vehicule.matricule ? "Modifier" : "Ajouter"}
            </ButtonFlow> */}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <ButtonFlow color="gray" onClick={handleOpen}>
            Annuler
          </ButtonFlow>
          <ButtonFlow onClick={handleSubmit}>Ajouter le vehicule</ButtonFlow>
        </Modal.Footer>
      </Modal>

      {/* Modal for Confirmation */}
      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        message="Êtes-vous sûr de vouloir supprimer ce véhicule?"
      />

      {/* Success Modal */}
      <ModalMessage
        show={openModalSuccess}
        onClose={() => setOpenModalSuccess(false)}
        isSuccess={true}
        message={successMessage}
      />

      {/* Error Modal */}
      <ModalMessage
        show={openModalError}
        onClose={() => setOpenModalError(false)}
        isSuccess={false}
        message={errorMessage}
      />
    </div>
  );
};

export default Vehicules;
