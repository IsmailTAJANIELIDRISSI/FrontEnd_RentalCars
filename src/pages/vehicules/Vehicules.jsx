import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {
  getVehicules,
  addVehicule,
  deleteVehicule,
  updateVehicule,
} from "./vehicules_service";
import { Plus, ShieldCheckIcon, UserIcon } from "lucide-react";
import {
  // Button,
  Button as ButtonFlow,
  FileInput,
  Label,
  Card as CardFlow,
  Modal,
  Select,
  TextInput,
  Carousel,
  Accordion,
  HR,
} from "flowbite-react";
import { HiCheckCircle, HiTrash, HiXCircle } from "react-icons/hi";

import { acceptPhotoAttribute, allowedPhotoExtensions } from "@/environment";
import ModalMessage from "@/widgets/modals/ModalMessage";
import ConfirmationModal from "@/widgets/modals/ConfirmationModal";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import MatriculeIcon from "@/widgets/icons/MatriculeIcon";
import { GiGearStickPattern } from "react-icons/gi";
import { FaGasPump, FaTachometerAlt } from "react-icons/fa";
import { addReservation } from "../locations/reservations_service";
import { ReservationModal } from "./../../widgets/modals/ReservationModal";
import { format } from "date-fns";
import { CiSearch } from "react-icons/ci";
import { IoPersonAdd } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";

const initialVehicule = {
  matricule: "",
  marque: "",
  nomVehicule: "",
  modele: "",
  typeCarburant: "diesel",
  modeBoite: "manuelle",
  puissance: 1,
  nbrSiege: 1,
  prixLocation: 1,
  typeAssurance: "RC",
  photos: [],
};

const Vehicules = () => {
  const [vehicules, setVehicules] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const [reload, setReload] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [vehicule, setVehicule] = useState(initialVehicule);

  useEffect(() => {
    // Fetch vehicles from your backend
    fetchData();
  }, [reload]);

  const fetchData = async () => {
    try {
      const res = await getVehicules();
      setVehicules(res.data.vehicules);
      setPhotos(res.data.photos);
      // Assuming `res.data.vehicules` and `res.data.photos` are arrays
      const updatedVehicules = res.data.vehicules.map((vehicule) => {
        // Filter the photos array to find photos that match the vehicle's matricule
        const matchingPhotos = res.data.photos.filter(
          (photo) => photo.matricule === vehicule.matricule,
        );

        // Assign the matching photos to the vehicle
        return {
          ...vehicule,
          photos: matchingPhotos,
        };
      });

      // Update the state with the updated vehicles list
      setVehicules(updatedVehicules);
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
    // setVehicule({ ...vehicule, [name]: value });
    setVehicule((prev) => ({
      ...prev,
      [name]: typeof value === "number" ? +value : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const { files } = e.target;

    const validFiles = Array.from(files).filter((file) =>
      allowedPhotoExtensions.includes(
        file.name.substring(file.name.lastIndexOf(".")).toLowerCase(),
      ),
    );
    setVehicule({ ...vehicule, photos: [...vehicule.photos, ...validFiles] });

    const updatedPhotos = [...uploadedPhotos];

    validFiles.forEach((file) => {
      updatedPhotos.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    setUploadedPhotos(updatedPhotos);

    e.target.value = "";
  };

  const handleDeletePhoto = (index, file) => {
    if (file.id) {
      setRemovedPhotos([...removedPhotos, file.id]);
    }
    const updatedPhotos = vehicule.photos.filter((_, i) => i !== index);
    const updatedPhotoss = uploadedPhotos.filter((_, i) => i !== index);
    setVehicule({ ...vehicule, photos: updatedPhotos });
    setUploadedPhotos(updatedPhotoss);

    // setReload(!reload);
  };

  const handleSaveReservation = (reservation) => {
    // Add new reservation logic
    const reservationData = {
      dateDebut: format(reservation.dateDebut, "yyy-MM-dd"),
      dateFin: format(reservation.dateFin, "yyyy-MM-dd"),
      lieuPrise: reservation.lieuPrise,
      lieuRecuperation: reservation.lieuRecuperation,
      idClient: reservation.client.idClient,
      matricule: reservation.vehicule.matricule,
      remise: reservation.remise,
      statutExpedition: reservation.statutExpedition,
      montant: reservation.total,
    };

    addReservation(reservationData)
      .then(() => {
        setSuccessMessage("Réservation ajouté avec succès !");
        setOpenModalSuccess(true);
        setOpenModal(false);
        setReload(!reload);
      })
      .catch(() => {
        setErrorMessage(
          "Une erreur s'est produite lors de l'ajout du réservation.",
        );
        setOpenModalError(true);
      });
  };

  const handleOpen = () => {
    setOpen(!open);
    setIsEditing(false);
  };

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

    const isValid = requiredFields.every((field) => {
      const value = vehicule[field];
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (typeof value === "number") {
        return value > 0;
      }
      return false;
    });

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

    if (isEditing) {
      const formData = new FormData();
      // console.log(newPhotos);
      // formData.append("matricule", vehicule.matricule);
      // formData.append("marque", vehicule.marque);
      // formData.append("modele", vehicule.modele);
      // formData.append("modeBoite", vehicule.modeBoite);
      // formData.append("typeCarburant", vehicule.typeCarburant);
      // formData.append("nbrSiege", vehicule.nbrSiege);
      // formData.append("puissance", vehicule.puissance);
      // formData.append("typeAssurance", vehicule.typeAssurance);
      // formData.append("prixLocation", vehicule.prixLocation);
      // removedPhotos.forEach((photo, index) => {
      //   formData.append(`removedPhotos[${index}]`, photo);
      // });
      // formData.append("removedPhotos", removedPhotos);

      // vehicule.photos.forEach((photo) => {
      //   formData.append("newPhotos[]", photo);
      // });
      // log;

      const newPhotos = vehicule.photos.filter((file) => !file.id);
      // setVehicule({
      //   ...vehicule,
      //   photos: newPhotos,
      // });
      console.log(newPhotos);

      Object.keys(vehicule).forEach((key) => {
        if (key === "photos") {
          newPhotos.forEach((photo) => {
            formData.append("newPhotos[]", photo);
          });
        } else {
          formData.append(key, vehicule[key]);
        }
        removedPhotos.forEach((photo, index) => {
          formData.append(`removedPhotos[${index}]`, photo);
        });
      });
      console.log(vehicule);

      updateVehicule(vehicule.matricule, formData)
        .then(() => {
          setUploadedPhotos([]);
          setIsEditing(false);
          setSuccessMessage("Véhicule modifié avec succès !");
          setOpenModalSuccess(true);
          setVehicule(initialVehicule);
          setReload(!reload);
          handleOpen();
        })
        .catch((err) => {
          setErrorMessage(
            "Une erreur s'est produite lors de modification du véhicule.",
          );
          setOpenModalError(true);
          console.error(err);
        })
        .finally(() => {
          handleOpen();
        });
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
      setVehicule(initialVehicule);
      setUploadedPhotos([]);
      setReload(!reload);
    } catch (err) {
      setErrorMessage("Une erreur s'est produite lors de l'ajout du véhicule.");
      setOpenModalError(true);
      console.error(err);
    }
    handleOpen();
  };

  return (
    <Card className="mt-10 h-full w-full ">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 mt-1 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Liste des véhicules
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="flex w-full gap-2">
              <TextInput
                type="text"
                // value={searchTerm}
                className="mr-2 rounded"
                // onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                // icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                icon={CiSearch}
              />

              <ButtonFlow
                onClick={() => {
                  handleOpen();
                  setVehicule(initialVehicule);
                }}
                // onClick={handleAddReservation}
                className=" flex items-center gap-3"
                color={"purple"}
                pill
              >
                <Plus className="mr-2 h-5 w-5" />
                Ajouter une véhicule
              </ButtonFlow>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex justify-around">
        <div className="grid-cols- mt-6 grid gap-20 md:grid-cols-2 xl:grid-cols-3">
          {vehicules.map((vehicule, index) => (
            <CardFlow className="max-w-md" key={index}>
              <h5 className="mb-4 text-center text-2xl font-extrabold">
                {vehicule.marque} {vehicule.modele}
              </h5>

              <div className="h-56 gap-4 bg-[#374151] bg-black sm:h-64  xl:h-80 2xl:h-60">
                <Carousel>
                  {vehicule.photos.map((photo, index) => (
                    <img
                      key={index}
                      // width="200"
                      // height="200"
                      src={`http://127.0.0.1:8042/storage/files/vehicules/photos/${photo.photo}`}
                      alt={`photo de ${vehicule.nomVehicule}`}
                      // className="w-80"
                      style={{ width: 300, height: 260 }}
                    />
                  ))}
                </Carousel>
              </div>

              <Accordion>
                <Accordion.Panel>
                  <Accordion.Title>Plus d'information</Accordion.Title>
                  <Accordion.Content>
                    <ul className="my-7 space-y-5">
                      <li className="flex items-center space-x-3">
                        <UserIcon className="mr-2 h-6 w-6 text-gray-500" />
                        <span>{vehicule.nbrSiege} sièges</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CurrencyDollarIcon className="mr-2 h-6 w-6 text-gray-500" />
                        <span>{vehicule.prixLocation} DH / jour</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <ShieldCheckIcon className="mr-2 h-6 w-6 text-gray-500" />
                        <span>Assurance: {vehicule.typeAssurance}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <MatriculeIcon iconClass="mr-2 h-6 w-6 text-gray-500" />
                        <span>Matricule: {vehicule.matricule}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <GiGearStickPattern className="mr-2 h-6 w-6 text-gray-500" />
                        <span>Mode de boite: {vehicule.modeBoite}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <FaGasPump className="mr-2 h-6 w-6 text-gray-500" />
                        <span>Type de carburant: {vehicule.typeCarburant}</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <FaTachometerAlt className="mr-2 h-6 w-6 text-gray-500" />
                        <span>Puissance: {vehicule.puissance}</span>
                      </li>
                    </ul>
                  </Accordion.Content>
                </Accordion.Panel>
              </Accordion>

              <div className="mt-6 flex items-center justify-between px-1 py-0">
                {/* <Link to={`/dashboard/locations`}> */}
                <ButtonFlow
                  onClick={() => setOpenModal(true)}
                  variant="outlined"
                  size="sm"
                  pill
                >
                  Réserver à un client
                </ButtonFlow>
                {/* </Link> */}
                {/* <Link to={`/dashboard/vehicules/${vehicule.matricule}/${false}`}>
                <ButtonFlow variant="outlined" size="sm" pill>
                  Voir le véhicule
                </ButtonFlow>
              </Link> */}
                <div className="flex space-x-2">
                  <ButtonFlow
                    pill
                    variant="outlined"
                    size="sm"
                    color="failure"
                    onClick={() => handleDelete(vehicule.matricule)}
                  >
                    Supprimer
                  </ButtonFlow>
                  {/* <Link
                    to={`/dashboard/vehicules/${vehicule.matricule}/${true}`}
                  > */}
                  <ButtonFlow
                    variant="outlined"
                    size="sm"
                    color="warning"
                    pill
                    onClick={() => {
                      setVehicule(vehicule);
                      setOpen(true);
                      setIsEditing(true);
                    }}
                  >
                    Modifier
                  </ButtonFlow>
                  {/* </Link> */}
                </div>
              </div>
            </CardFlow>
          ))}
        </div>
      </CardBody>
      {/* <Card className="-mt-50 mx-3 mb-6 border border-blue-gray-100 lg:mx-4">
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
      </Card> */}
      {/* Modal for Adding or Editing Vehicle */}
      <Modal
        show={open}
        onClose={() => {
          setOpen(false);
          setIsEditing(false);
        }}
        size="2xl"
        popup
      >
        <Modal.Header className="p-4">
          {!isEditing ? "Ajouter un véhicule" : "Modifier le véhicule"}
        </Modal.Header>
        <HR className="mt-0 pt-0" />

        <Modal.Body>
          <div className="space-y-6">
            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white"></h3> */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="matricule" value="Matricule" />
                </div>
                <TextInput
                  id="matricule"
                  name="matricule"
                  placeholder="Matricule"
                  value={vehicule.matricule}
                  onChange={(e) => handleChange("matricule", e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="marque" value="Marque" />
                </div>
                <TextInput
                  id="marque"
                  name="marque"
                  placeholder="Marque"
                  value={vehicule.marque}
                  onChange={(e) => handleChange("marque", e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nomVehicule" value="Nom du véhicule" />
                </div>
                <TextInput
                  id="nomVehicule"
                  name="nomVehicule"
                  placeholder="Nom de véhicule"
                  value={vehicule.nomVehicule}
                  onChange={(e) => handleChange("nomVehicule", e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="modele" value="Modèle" />
                </div>
                <TextInput
                  id="modele"
                  name="modele"
                  placeholder="Modele"
                  value={vehicule.modele}
                  onChange={(e) => handleChange("modele", e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="typeCarburant" value="Type de carburant" />
                </div>
                <Select
                  id="typeCarburant"
                  value={vehicule.typeCarburant}
                  onChange={(e) =>
                    handleChange("typeCarburant", e.target.value)
                  }
                >
                  <option value="diesel">Diesel</option>
                  <option value="essence">Essence</option>
                  <option value="electrique">Electrique</option>
                </Select>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="modeBoite" value="Mode de boîte" />
                </div>
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
                <div className="mb-2 block">
                  <Label htmlFor="puissance" value="Puissance" />
                </div>
                <TextInput
                  id="puissance"
                  name="puissance"
                  placeholder="Puissance"
                  value={vehicule.puissance}
                  type="number"
                  min="1"
                  onChange={(e) => handleChange("puissance", +e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nbrSiege" value="Nombre de sièges" />
                </div>
                <TextInput
                  id="nbrSiege"
                  name="nbrSiege"
                  min="1"
                  placeholder="Nombre de sièges"
                  value={vehicule.nbrSiege}
                  type="number"
                  onChange={(e) => handleChange("nbrSiege", +e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="prixLocation" value="Prix de location" />
                </div>
                <TextInput
                  id="prixLocation"
                  type="number"
                  name="prixLocation"
                  placeholder="Prix de location"
                  value={vehicule.prixLocation}
                  min="1"
                  onChange={(e) =>
                    handleChange("prixLocation", +e.target.value)
                  }
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="typeAssurance" value="Type d'assurance" />
                </div>
                <Select
                  id="typeAssurance"
                  value={vehicule.typeAssurance}
                  onChange={(e) =>
                    handleChange("typeAssurance", e.target.value)
                  }
                >
                  <option value="RC">Responsabilité Civile</option>
                  <option value="tout risque">Tous risques</option>
                </Select>
              </div>

              {/* display photos uploaded */}
              {/* display photos uploaded */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {isEditing
                  ? vehicule.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={
                            photo?.photo
                              ? `http://127.0.0.1:8042/storage/files/vehicules/photos/${photo.photo}`
                              : URL.createObjectURL(photo)
                          }
                          alt="photo"
                          className="h-24 w-24 rounded object-cover"
                        />
                        <IconButton
                          className="rounded-full bg-white p-1 text-red-600 shadow"
                          color="red"
                          size="sm"
                          onClick={() => handleDeletePhoto(index, photo)}
                        >
                          <HiTrash className="h-5 w-5" />
                        </IconButton>
                      </div>
                    ))
                  : uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo.preview}
                          alt={`Uploaded preview ${index}`}
                          className="h-24 w-24 rounded object-cover"
                        />
                        <IconButton
                          className="rounded-full bg-white p-1 text-red-600 shadow"
                          color="red"
                          size="sm"
                          onClick={() => handleDeletePhoto(index, photo)}
                        >
                          <HiTrash className="h-5 w-5" />
                        </IconButton>
                      </div>
                    ))}
              </div>

              <div className="col-span-2 flex w-full items-center justify-center">
                <Label
                  htmlFor="dropzone-file"
                  className="h-54 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        Cliquez pour télécharger
                      </span>{" "}
                      ou faites glisser et déposez
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG ou GIF - Taille recommandée: 300x260 pixels
                    </p>
                  </div>
                  <FileInput
                    id="dropzone-file"
                    className="hidden"
                    accept={acceptPhotoAttribute}
                    multiple
                    onChange={handlePhotoUpload}
                  />
                </Label>
              </div>

              {/* <div>
              <Label htmlFor="photos" value="Photos" />
              <FileInput
                id="photos"
                accept={acceptPhotoAttribute}
                multiple
                onChange={handlePhotoUpload}
              />
            </div> */}
              {/* <ButtonFlow type="submit" color="blue" size="md">
              {vehicule.matricule ? "Modifier" : "Ajouter"}
            </ButtonFlow> */}
            </div>
          </div>
        </Modal.Body>
        <HR className="m-0 mt-2 pt-0" />
        <Modal.Footer className="flex justify-end">
          <ButtonFlow color="gray" onClick={handleOpen}>
            Annuler
          </ButtonFlow>
          <ButtonFlow onClick={handleSubmit}>
            {!isEditing ? "Ajouter le vehicule" : "Modifier le vehicule"}
          </ButtonFlow>
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
      <ReservationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveReservation}
      />
    </Card>
  );
};

export default Vehicules;
