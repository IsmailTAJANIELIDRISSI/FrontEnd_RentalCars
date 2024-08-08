import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Carousel,
  Typography,
  // Input,
  Button,
  IconButton,
  // Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import { getVehiculeByMatricule, updateVehicule } from "./vehicules_service";
import {
  UserIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import { acceptPhotoAttribute, allowedPhotoExtensions } from "@/environment";
import MatriculeIcon from "@/widgets/icons/MatriculeIcon";
import { GiGearStickPattern } from "react-icons/gi";
import { FaGasPump, FaTachometerAlt } from "react-icons/fa";
import {
  FileInput,
  TextInput,
  Select,
  Button as ButtonFlow,
  Label,
} from "flowbite-react";

const VehiculeDetail = () => {
  const { matricule, edit } = useParams();
  const navigate = useNavigate();
  const [vehicule, setVehicule] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [vehiculeData, setVehiculeData] = useState(new FormData());

  const [enums, setEnums] = useState({
    modeBoites: ["Automatique", "Manuelle", "Hybride"],
    typeCarburants: ["Essence", "Diesel", "Electrique"],
    typeAssurances: ["RC", "Tout risque"],
  });
  const [editing, setEditing] = useState(edit == "false" ? false : true);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    // console.log(newPhotos);
    console.log(edit);
    console.log(editing);
    getVehicule();
  }, [reload]);

  const getVehicule = () => {
    getVehiculeByMatricule(matricule).then((res) => {
      setVehicule(res.data.vehicule);
      setPhotos(res.data.vehicule.photos);
    });
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleInputChange = (name, value) => {
    setVehicule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newPhotos);
    console.log(removedPhotos);
    const formData = new FormData();
    // console.log(newPhotos);
    formData.append("matricule", vehicule.matricule);
    formData.append("marque", vehicule.marque);
    formData.append("modele", vehicule.modele);
    formData.append("modeBoite", vehicule.modeBoite);
    formData.append("typeCarburant", vehicule.typeCarburant);
    formData.append("nbrSiege", vehicule.nbrSiege);
    formData.append("puissance", vehicule.puissance);
    formData.append("typeAssurance", vehicule.typeAssurance);
    formData.append("prixLocation", vehicule.prixLocation);
    removedPhotos.forEach((photo, index) => {
      formData.append(`removedPhotos[${index}]`, photo);
    });
    // formData.append("removedPhotos", removedPhotos);

    newPhotos.forEach((photo) => {
      formData.append("newPhotos[]", photo);
    });

    updateVehicule(matricule, formData).then(() => {
      setNewPhotos([]);
      setEditing(false);
      setReload(!reload);
    });
  };

  const handlePhotoDelete = (photoId) => {
    if (typeof photoId !== "number") {
      setNewPhotos(newPhotos.filter((photo) => photo.name !== photoId.name));
    } else {
      setRemovedPhotos([...removedPhotos, photoId]);
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    }
  };

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
      setNewPhotos([...newPhotos, ...validFiles]);
    }

    // Clear the input value to allow the same file to be uploaded again if needed
    e.target.value = "";
  };

  if (!vehicule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto my-8 p-4">
      {/* <Link to="/dashboard/vehicules" className="mb-4 text-blue-500 underline">
        Retour à la liste
      </Link> */}
      <Link to="/dashboard/vehicules">
        <Button variant="text" className="mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              // fillRule="evenodd"
              d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
              // clipRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Retour à la liste
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
        {photos.length > 0 || newPhotos.length > 0 ? (
          <Carousel className="rounded-xl">
            {[...newPhotos, ...photos].map((photo, index) => (
              <div key={index} className="relative">
                {editing && (
                  <div
                    className="absolute right-2 top-2"
                    onClick={() => handlePhotoDelete(photo.id || photo)}
                  >
                    <IconButton className="" color="red" size="sm">
                      <span>
                        <i className="fas fa-trash"></i>
                      </span>
                    </IconButton>
                  </div>
                )}
                <img
                  src={
                    photo.photo
                      ? `http://127.0.0.1:8042/storage/files/vehicules/photos/${photo.photo}`
                      : URL.createObjectURL(photo)
                  }
                  alt={`vehicule photo ${index + 1}`}
                  className="mt-60 h-full w-full object-cover"
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="flex w-full items-center justify-center">
            {editing ? (
              <>
                <label
                  htmlFor="dropzone-file"
                  className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:bg-gray-800"
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <TextInput
                    id="dropzone-file"
                    type="file"
                    multiple
                    className="hidden"
                    accept={acceptPhotoAttribute}
                    onChange={handlePhotoUpload}
                  />
                </label>
              </>
            ) : (
              <div className="flex w-full items-center justify-center">
                <Typography variant="h4" className="">
                  Aucune photo de cet article trouvée
                </Typography>
              </div>
            )}
          </div>
        )}

        <div>
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="marque" value="Marque" />
                </div>
                <TextInput
                  required
                  type="text"
                  size="lg"
                  value={vehicule.marque}
                  onChange={(e) => handleInputChange("marque", e.target.value)}
                  name="marque"
                  placeholder="Entrez la marque"
                />
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="modele" value="Modèle" />
                </div>
                <TextInput
                  required
                  type="text"
                  size="lg"
                  value={vehicule.modele}
                  onChange={(e) => handleInputChange("modele", e.target.value)}
                  name="modele"
                  placeholder="Entrez le modèle"
                />
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="modeBoite" value="Mode de boîte" />
                </div>
                <Select
                  name="typeBoite"
                  value={vehicule.modeBoite}
                  defaultValue={vehicule.modeBoite}
                  onChange={(e) =>
                    handleInputChange("modeBoite", e.target.value)
                  }
                >
                  {enums.modeBoites.map((mode, index) => (
                    <option
                      value={mode}
                      key={index}
                      selected={
                        vehicule.modeBoite.toLowerCase() === mode.toLowerCase()
                      }
                    >
                      {mode}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="typeCarburant" value="Type de carburant" />
                </div>
                <Select
                  name="typeCarburant"
                  value={vehicule.typeCarburant}
                  onChange={(e) =>
                    handleInputChange("typeCarburant", e.target.value)
                  }
                  defaultValue={"Manuelle"}
                >
                  {enums.typeCarburants.map((typeCar, index) => (
                    <option key={index} value={typeCar}>
                      {typeCar}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="nbrSiege" value="Nombre de sièges" />
                </div>
                <TextInput
                  required
                  type="number"
                  size="lg"
                  value={vehicule.nbrSiege}
                  onChange={(e) =>
                    handleInputChange("nbrSiege", e.target.value)
                  }
                  name="nbrSiege"
                  placeholder="Entrez le nombre de sièges"
                />
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="puissance" value="Puissance" />
                </div>
                <TextInput
                  required
                  type="number"
                  size="lg"
                  value={vehicule.puissance}
                  onChange={(e) =>
                    handleInputChange("puissance", e.target.value)
                  }
                  name="puissance"
                  placeholder="Entrez la puissance"
                />
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="prixLocation" value="Prix de location" />
                </div>
                <TextInput
                  required
                  type="number"
                  size="lg"
                  value={vehicule.prixLocation}
                  onChange={(e) =>
                    handleInputChange("prixLocation", e.target.value)
                  }
                  name="prixLocation"
                  placeholder="Entrez le prix de location"
                />
              </div>
              <div className="mb-4">
                <div className="mb-2 block">
                  <Label htmlFor="typeAssurance" value="Type d'assurance" />
                </div>
                <Select
                  name="typeAssurance"
                  value={vehicule.typeAssurance}
                  onChange={(e) =>
                    handleInputChange("typeAssurance", e.target.value)
                  }
                >
                  {enums.typeAssurances.map((typeAss, index) => (
                    <option key={index} value={typeAss}>
                      {typeAss}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mx-auto mb-4 mt-6 max-w-2xl">
                <div className="mb-2 block">
                  <Label
                    htmlFor="file_input"
                    value="Téléchargez de nouvelles photos"
                  />
                </div>
                <FileInput
                  className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                  id="file_input"
                  type="file"
                  multiple
                  onChange={handlePhotoUpload}
                  accept={acceptPhotoAttribute}
                  name="newPhotos"
                />
              </div>
              <div className="mt-10 flex justify-end">
                <ButtonFlow type="submit" color="success" ripple="light">
                  Enregistrer
                </ButtonFlow>
              </div>
            </form>
          ) : (
            <div className="capitalize">
              <Typography variant="h4" className="mb-4">
                {vehicule.marque} {vehicule.modele}
              </Typography>
              <div className="mb-2 flex items-center">
                <UserIcon className="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  {vehicule.nbrSiege} sièges
                </Typography>
              </div>
              <div className="mb-2 flex items-center">
                <CurrencyDollarIcon className="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  {vehicule.prixLocation} DH / jour
                </Typography>
              </div>

              <div className="mb-2 flex items-center">
                <ShieldCheckIcon className="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  Assurance: {vehicule.typeAssurance}
                </Typography>
              </div>
              <div className="mb-2 flex items-center">
                <MatriculeIcon iconClass="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  Matricule: {vehicule.matricule}
                </Typography>
              </div>
              <div className="mb-2 flex items-center">
                <GiGearStickPattern className="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  Mode de boite: {vehicule.modeBoite}
                </Typography>
              </div>
              <div className="mb-2 flex items-center">
                <FaGasPump className="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  Type de carburant: {vehicule.typeCarburant}
                </Typography>
              </div>
              <div className="mb-2 flex items-center">
                <FaTachometerAlt className="mr-2 h-6 w-6 text-gray-500" />
                <Typography variant="body1">
                  Puissance: {vehicule.puissance}
                </Typography>
              </div>
              <div className="mt-10 flex justify-end">
                <Button
                  variant="gradient"
                  color="blue"
                  onClick={handleEditToggle}
                  className="flex items-center gap-3"
                >
                  <UserIcon className="h-5 w-5" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetail;
