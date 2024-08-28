import React, { useState, useEffect } from "react";
import {
  Table,
  TextInput,
  Pagination,
  Modal,
  Button as ButtonFlow,
  Label,
  Textarea,
} from "flowbite-react";
import { getReclamation, addReclamation } from "./reclamation_service"; // Assurez-vous d'avoir la fonction addReclamation dans votre service
import { Plus } from "lucide-react";
import ModalMessage from "@/widgets/modals/ModalMessage"; // Si vous avez ce composant pour les messages de succès/erreur
import { CiSearch } from "react-icons/ci";
import {
  Card,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

const Reclamations = () => {
  const [reclamations, setReclamations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(false);
  const reclamationsPerPage = 10;

  const [openModal, setOpenModal] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newReclamation, setNewReclamation] = useState({
    description: "",
    matriculeVehicule: "",
    idClient: "",
    dateReclamation: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReclamation(
          searchTerm,
          reclamationsPerPage,
          currentPage,
        );
        setReclamations(res.data.data);
        setTotalPages(res.data.last_page);
      } catch (error) {
        console.error("Error fetching reclamations:", error);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, reload]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenModal = () => setOpenModal(!openModal);

  const handleChange = (name, value) => {
    setNewReclamation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    addReclamation(newReclamation)
      .then((res) => {
        setSuccessMessage("Réclamation ajoutée avec succès !");
        setOpenModalSuccess(true);
        setNewReclamation({
          description: "",
          matriculeVehicule: "",
          idClient: "",
          dateReclamation: "",
        });
        handleOpenModal();
        setReload(!reload);
      })
      .catch((err) => {
        setErrorMessage(
          "Une erreur s'est produite lors de l'ajout de la réclamation.",
        );
        setOpenModalError(true);
        console.error(err);
      });
  };

  return (
    <Card className="mt-10 h-full w-full ">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 mt-1 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Liste des réclamations
            </Typography>
          </div>{" "}
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="flex w-full gap-2">
              <TextInput
                type="text"
                // value={searchTerm}
                className="mr-2 rounded"
                // onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                // icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={handleSearch}
                icon={CiSearch}
              />
              <ButtonFlow
                className=" flex items-center gap-3"
                color={"failure"}
                pill
                onClick={handleOpenModal}
              >
                <Plus className="mr-2 h-5 w-5" />
                <span>Ajouter une réclamation</span>
              </ButtonFlow>
            </div>
          </div>
        </div>
      </CardHeader>

      <Table>
        <Table.Head>
          <Table.HeadCell>Date de Réclamation</Table.HeadCell>
          <Table.HeadCell>Client</Table.HeadCell>
          <Table.HeadCell>Matricule du Véhicule</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {reclamations.map((reclamation) => (
            <Table.Row
              key={reclamation.idReclamation}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {reclamation.dateReclamation}
              </Table.Cell>
              <Table.Cell>{reclamation.idClient}</Table.Cell>
              <Table.Cell>{reclamation.matriculeVehicule}</Table.Cell>
              <Table.Cell>{reclamation.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <CardFooter className=" border-t border-blue-gray-200 bg-blue-gray-50 p-4">
        {/* <Typography variant="small" color="blue-gray" className="font-normal">
          {reservations.length} résultats trouvés
          </Typography> */}
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            showIcons
            onPageChange={setCurrentPage}
          />
        </div>
      </CardFooter>

      {/* Modal for Adding Reclamation */}
      <Modal show={openModal} onClose={handleOpenModal} size="lg" popup>
        <Modal.Header>Ajouter une réclamation</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                value={newReclamation.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="matriculeVehicule"
                value="Matricule du Véhicule"
              />
              <TextInput
                id="matriculeVehicule"
                value={newReclamation.matriculeVehicule}
                onChange={(e) =>
                  handleChange("matriculeVehicule", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="idClient" value="ID Client" />
              <TextInput
                id="idClient"
                value={newReclamation.idClient}
                onChange={(e) => handleChange("idClient", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateReclamation" value="Date de Réclamation" />
              <TextInput
                id="dateReclamation"
                type="date"
                value={newReclamation.dateReclamation}
                onChange={(e) =>
                  handleChange("dateReclamation", e.target.value)
                }
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonFlow color="gray" onClick={handleOpenModal}>
            Annuler
          </ButtonFlow>
          <ButtonFlow onClick={handleSubmit}>Ajouter la réclamation</ButtonFlow>
        </Modal.Footer>
      </Modal>

      {/* Success and Error Modals */}
      <ModalMessage
        show={openModalSuccess}
        onClose={() => setOpenModalSuccess(false)}
        isSuccess={true}
        message={successMessage}
      />
      <ModalMessage
        show={openModalError}
        onClose={() => setOpenModalError(false)}
        isSuccess={false}
        message={errorMessage}
      />
    </Card>
  );
};

export default Reclamations;
