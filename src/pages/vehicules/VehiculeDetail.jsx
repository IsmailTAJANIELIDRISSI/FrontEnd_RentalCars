import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Carousel,
  Typography,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  UserIcon,
  BriefcaseIcon,
  ClockIcon,
  LocationMarkerIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import {
  getVehiculeByMatricule,
  deletePhoto,
  uploadPhoto,
} from "./vehicules_service";

const VehiculeDetail = () => {
  const { matricule } = useParams();
  const navigate = useNavigate();
  const [vehicule, setVehicule] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getVehicule();
  }, []);

  const getVehicule = () => {
    getVehiculeByMatricule(matricule).then((res) => {
      setVehicule(res.data.vehicule);
      setPhotos(res.data.photos);
    });
  };

  const handleEditToggle = () => {
    setEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update vehicule logic here
  };

  const handlePhotoDelete = (photoId) => {
    deletePhoto(photoId).then(() => {
      setPhotos(photos.filter((photo) => photo.id !== photoId));
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos", file);
    });
    // Upload photo logic here
  };

  if (!vehicule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto my-8 p-4">
      <Link to="/vehicules" className="mb-4 text-blue-500 underline">
        Retour à la liste
      </Link>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Carousel className="rounded-xl">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo.url} // Ensure this is the correct path to your photo
                alt={`vehicule photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {editing && (
                <IconButton
                  className="absolute right-2 top-2"
                  color="red"
                  size="sm"
                  onClick={() => handlePhotoDelete(photo.id)}
                >
                  <i className="fas fa-trash"></i>
                </IconButton>
              )}
            </div>
          ))}
        </Carousel>
        <div>
          {editing ? (
            <form onSubmit={handleSubmit}>
              <Typography variant="h4" className="mb-4">
                Modifier Véhicule
              </Typography>
              <div className="mb-4">
                <Typography variant="h6" className="mb-1">
                  Marque
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  value={vehicule.marque}
                  onChange={handleInputChange}
                  name="marque"
                />
              </div>
              <div className="mb-4">
                <Typography variant="h6" className="mb-1">
                  Modèle
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  value={vehicule.modele}
                  onChange={handleInputChange}
                  name="modele"
                />
              </div>
              <div className="mb-4">
                <Typography variant="h6" className="mb-1">
                  Type
                </Typography>
                <Input
                  type="text"
                  size="lg"
                  value={vehicule.type}
                  onChange={handleInputChange}
                  name="type"
                />
              </div>
              <div className="mb-4">
                <Typography variant="body1" className="mb-1">
                  Matricule: {vehicule.matricule}
                </Typography>
              </div>
              <div className="mb-4">
                <Typography variant="body1" className="mb-1">
                  Nombre de Sièges: {vehicule.nbrSiege}
                </Typography>
              </div>
              <div className="mb-4">
                <Typography variant="body1" className="mb-1">
                  Prix de Location: {vehicule.prixLocation}
                </Typography>
              </div>
              <div className="mb-4">
                <Typography variant="body1" className="mb-1">
                  Type d'Assurance: {vehicule.typeAssurance}
                </Typography>
              </div>
              <div className="mb-4">
                <Typography variant="body1" className="mb-1">
                  Téléverser de nouvelles photos :
                </Typography>
                <Input
                  type="file"
                  multiple
                  onChange={handlePhotoUpload}
                  name="newPhotos"
                />
              </div>
              <Button type="submit" color="blue" ripple="light">
                Enregistrer les modifications
              </Button>
            </form>
          ) : (
            <div>
              <div className="mb-4 flex items-center">
                <HeartIcon className="mr-2 h-5 w-5 text-blue-500" />
                <Typography variant="h5" className="font-bold">
                  Coup de cœur
                </Typography>
              </div>
              <Typography variant="h4" className="mb-4">
                {vehicule.marque} {vehicule.modele}
              </Typography>
              <div className="mb-2 flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                <Typography variant="body1">
                  {vehicule.nbrSiege} sièges
                </Typography>
              </div>
              <div className="mb-2 flex items-center">
                <ClockIcon className="mr-2 h-5 w-5" />
                <Typography variant="body1">{vehicule.transmission}</Typography>
              </div>
              <div className="mb-2 flex items-center">
                <BriefcaseIcon className="mr-2 h-5 w-5" />
                <Typography variant="body1">1 grande valise</Typography>
              </div>
              <div className="mb-2 flex items-center">
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                <Typography variant="body1">1 petite valise</Typography>
              </div>
              <div className="mb-2 flex items-center">
                <LocationMarkerIcon className="mr-2 h-5 w-5" />
                <Typography variant="body1">Kilométrage illimité</Typography>
              </div>
              <div className="mt-4">
                <Typography variant="body1" className="font-bold">
                  {vehicule.location}
                </Typography>
                <Typography variant="body1">Centre-ville</Typography>
              </div>
              <Button
                onClick={handleEditToggle}
                color="blue"
                ripple="light"
                className="mt-4"
              >
                Modifier
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetail;
