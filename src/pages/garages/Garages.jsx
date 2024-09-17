import React, { useState, useEffect } from "react";
import {
  Table,
  TextInput,
  Button as ButtonFlow,
  Modal,
  Label,
  Pagination,
  Textarea,
  HR,
  Card,
  Tooltip,
} from "flowbite-react";
import { BsPencilSquare } from "react-icons/bs";

import { FaBuildingShield } from "react-icons/fa6";

import { getGaragesByCriteria, addGarage, editGarage } from "./garages_service";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import ModalMessage from "@/widgets/modals/ModalMessage";
import { CardHeader, IconButton, Typography } from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";
import Loading from "@/widgets/loading/Loading";

const initialGarage = {
  nomGarage: "",
  adresseGarage: "",
  telephone: "",
  descriptionGarage: "",
};

const Garages = () => {
  const [garages, setGarages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGarageId, setSelectedGarageId] = useState(null);
  const [newGarage, setNewGarage] = useState(initialGarage);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const garagesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getGaragesByCriteria(
          searchTerm,
          garagesPerPage,
          currentPage,
        );
        setGarages(res.data.data);
        setTotalPages(res.data.last_page);
      } catch (error) {
        console.error("Error fetching garages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGarage({ ...newGarage, [name]: value });
  };

  const handleOpenModal = () => {
    setNewGarage(initialGarage);
    setIsEditing(false);
    setOpenModal(!openModal);
  };

  const handleAddGarage = () => {
    if (
      !newGarage.nomGarage ||
      !newGarage.adresseGarage ||
      !newGarage.telephone
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setOpenModalError(true);
      return;
    }

    addGarage(newGarage)
      .then((res) => {
        setSuccessMessage("Garage ajouté avec succès !");
        setOpenModalSuccess(true);
        setOpenModal(false);
        setNewGarage({
          nomGarage: "",
          adresseGarage: "",
          telephone: "",
          descriptionGarage: "",
        });
        setGarages([res.data.garage, ...garages]);
      })
      .catch((err) => {
        setErrorMessage("Une erreur s'est produite lors de l'ajout du garage.");
        setOpenModalError(true);
      });
  };

  const handleEditGarage = (garage) => {
    setIsEditing(true);
    setSelectedGarageId(garage.idGarage);
    setNewGarage({
      nomGarage: garage.nomGarage,
      adresseGarage: garage.adresseGarage,
      telephone: garage.telephone,
      descriptionGarage: garage.descriptionGarage,
    });
    setOpenModal(true);
  };

  const handleEditSubmit = () => {
    if (
      !newGarage.nomGarage ||
      !newGarage.adresseGarage ||
      !newGarage.telephone
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setOpenModalError(true);
      return;
    }

    editGarage(selectedGarageId, newGarage)
      .then((res) => {
        setSuccessMessage("Garage modifié avec succès !");
        setOpenModalSuccess(true);
        setOpenModal(false);
        setNewGarage({
          nomGarage: "",
          adresseGarage: "",
          telephone: "",
          descriptionGarage: "",
        });
        const updatedGarages = garages.map((garage) =>
          garage.idGarage === selectedGarageId ? res.data.garage : garage,
        );
        setGarages(updatedGarages);
        setIsEditing(false);
        setSelectedGarageId(null);
      })
      .catch((err) => {
        setErrorMessage(
          "Une erreur s'est produite lors de la modification du garage.",
        );
        setOpenModalError(true);
      });
  };

  return (
    <Card className="mt-10 h-full w-full ">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 mt-1 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Liste des garages
            </Typography>
          </div>{" "}
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="flex w-full gap-2">
              <TextInput
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="mr-2 rounded"
                placeholder="Rechercher..."
                icon={CiSearch}
              />
              <ButtonFlow
                className=" flex items-center gap-3"
                pill
                onClick={handleOpenModal}
                color={"blue"}
                disabled={loading}
              >
                <FaBuildingShield className="mr-2 h-4 w-4" />
                <span>Ajouter un garage</span>
              </ButtonFlow>
            </div>
          </div>
        </div>
      </CardHeader>
      {loading ? (
        <Loading />
      ) : garages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p>Aucun garage n'est disponible au ce moment</p>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Nom du Garage</Table.HeadCell>
            <Table.HeadCell>Description du Garage</Table.HeadCell>
            <Table.HeadCell>Adresse</Table.HeadCell>
            <Table.HeadCell>Téléphone</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {garages.map((garage, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {garage.nomGarage}
                </Table.Cell>
                <Table.Cell>{garage.descriptionGarage}</Table.Cell>
                <Table.Cell>{garage.adresseGarage}</Table.Cell>
                <Table.Cell>{garage.telephone}</Table.Cell>
                <Table.Cell>
                  {/* <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                  Edit
                  </a> */}
                  <Tooltip content="Modifier">
                    <IconButton
                      variant="text"
                      onClick={() => handleEditGarage(garage)}
                    >
                      {/* <PencilIcon className="h-4 w-4" /> */}
                      <BsPencilSquare className="h-5 w-5 text-orange-500" />
                    </IconButton>
                  </Tooltip>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      <div className="mt-4 flex justify-center">
        <Pagination
          showIcons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal for Adding or Editing Garage */}
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          setIsEditing(false);
          setSelectedGarageId(null);
        }}
        popup
      >
        <Modal.Header className="p-4">
          {isEditing ? "Modifier le garage" : "Ajouter un garage"}
        </Modal.Header>
        <HR className="mt-0 pt-0" />
        <Modal.Body>
          <div className="space-y-6">
            {/* <h3 className="text-xl font-medium text-gray-900 dark:text-white"></h3> */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nomGarage" value="Nom du Garage" />
                </div>
                <TextInput
                  id="nomGarage"
                  name="nomGarage"
                  placeholder="Nom du Garage"
                  value={newGarage.nomGarage}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="telephone" value="Téléphone" />
                </div>
                <TextInput
                  id="telephone"
                  name="telephone"
                  placeholder="Téléphone"
                  value={newGarage.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-span-2">
                <div className="mb-2 block">
                  <Label htmlFor="adresseGarage" value="Adresse du Garage" />
                </div>
                <TextInput
                  id="adresseGarage"
                  name="adresseGarage"
                  placeholder="Adresse du Garage"
                  value={newGarage.adresseGarage}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="mb-2 block">
                <Label htmlFor="descriptionGarage" value="Description Garage" />
              </div>
              <Textarea
                id="descriptionGarage"
                name="descriptionGarage"
                placeholder="Garage spécialisé dans l'entretien et la réparation de véhicules toutes marques. Équipe professionnelle et service rapide."
                rows={6}
                onChange={handleInputChange}
                value={newGarage.descriptionGarage}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <HR className="m-0 mt-2 pt-0" />

        <Modal.Footer className="flex justify-end">
          <ButtonFlow color="gray" onClick={() => setOpenModal(false)}>
            Annuler
          </ButtonFlow>
          <ButtonFlow
            color={"blue"}
            onClick={isEditing ? handleEditSubmit : handleAddGarage}
          >
            {isEditing ? "Modifier le garage" : "Ajouter le garage"}
          </ButtonFlow>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <ModalMessage
        show={openModalSuccess}
        onClose={() => setOpenModalSuccess(false)}
        message={successMessage}
        isSuccess
      />

      {/* Error Modal */}
      <ModalMessage
        show={openModalError}
        onClose={() => setOpenModalError(false)}
        message={errorMessage}
        isSuccess={false}
      />
    </Card>
  );
};

export default Garages;
