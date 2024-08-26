import React, { useState, useEffect } from "react";
import { Table, TextInput, Pagination, Modal, Button as ButtonFlow, Label, Textarea } from "flowbite-react";
import { getReclamation, addReclamation } from "./reclamation_service"; // Assurez-vous d'avoir la fonction addReclamation dans votre service
import { Plus } from "lucide-react";
import ModalMessage from "@/widgets/modals/ModalMessage"; // Si vous avez ce composant pour les messages de succès/erreur

const Reclamations = () => {
  const [reclamations, setReclamations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reload,setReload]=useState(false);
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
        const res = await getReclamation(searchTerm, reclamationsPerPage, currentPage);
        setReclamations(res.data.data);
        setTotalPages(res.data.last_page);
      } catch (error) {
        console.error("Error fetching reclamations:", error);
      }
    };

    fetchData();
  }, [searchTerm, currentPage,reload]);

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
   
      addReclamation(newReclamation).then(res=>{
        setSuccessMessage("Réclamation ajoutée avec succès !");
        setOpenModalSuccess(true);
        setNewReclamation({
        description: "",
        matriculeVehicule: "",
        idClient: "",
        dateReclamation: "",
      })
     handleOpenModal();
      setReload(!reload);
    }).catch ((err)=> {
      setErrorMessage("Une erreur s'est produite lors de l'ajout de la réclamation.");
      setOpenModalError(true);
      console.error(err);
    })
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 mt-10 flex items-center justify-between">
        <h1 className="text-xl font-bold">Liste des réclamations</h1>
        <ButtonFlow gradientDuoTone="purpleToBlue" className="rounded-full" onClick={handleOpenModal}>
          <Plus className="mr-2 h-5 w-5" />
          <span>Ajouter une réclamation</span>
        </ButtonFlow>
      </div>
      <div className="mb-4">
        <TextInput
          type="text"
          placeholder="Rechercher une réclamation par description ou matricule"
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
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
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

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
              <Label htmlFor="matriculeVehicule" value="Matricule du Véhicule" />
              <TextInput
                id="matriculeVehicule"
                value={newReclamation.matriculeVehicule}
                onChange={(e) => handleChange("matriculeVehicule", e.target.value)}
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
                onChange={(e) => handleChange("dateReclamation", e.target.value)}
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
    </div>
  );
};

export default Reclamations;
