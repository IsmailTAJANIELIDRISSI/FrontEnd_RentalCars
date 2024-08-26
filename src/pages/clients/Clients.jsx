import React, { useState, useEffect } from "react";
import {
  Table,
  TextInput,
  Pagination,
  Modal,
  Button as ButtonFlow,
  Label,
} from "flowbite-react";
import { addClient, editClient, getClients } from "./clients_service";
import { Plus } from "lucide-react";
import ModalMessage from "@/widgets/modals/ModalMessage";

export function Clients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(null);

  const [clientData, setClientData] = useState({
    nomClient: "",
    prenomClient: "",
    email: "",
    dateNaissance: "",
    telephone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getClients(searchTerm, currentPage);
        setClients(res.data.data || []);
        setTotalPages(res.data.last_page || 1); // Utilisation d'une valeur par défaut
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, reload]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenModal = () => {
    setOpenModal(!openModal);
    setIsEditing(false);
    setClientData({
      nomClient: "",
      prenomClient: "",
      email: "",
      dateNaissance: "",
      telephone: "",
    });
  };

  const handleChange = (name, value) => {
    setClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (client) => {
    setClientData({
      nomClient: client.nomClient,
      prenomClient: client.prenomClient,
      email: client.email,
      dateNaissance: client.dateNaissance,
      telephone: client.telephone,
    });
    setCurrentClientId(client.idClient);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (isEditing) {
      editClient(currentClientId, clientData)
        .then((res) => {
          setSuccessMessage("Client modifié avec succès !");
          setOpenModalSuccess(true);
          setReload(!reload);
        })
        .catch((err) => {
          setErrorMessage(
            "Une erreur s'est produite lors de la modification du client."
          );
          setOpenModalError(true);
          console.error(err);
        });
    } else {
      addClient(clientData)
        .then((res) => {
          setSuccessMessage("Client ajouté avec succès !");
          setOpenModalSuccess(true);
          setReload(!reload);
        })
        .catch((err) => {
          setErrorMessage(
            "Une erreur s'est produite lors de l'ajout du client."
          );
          setOpenModalError(true);
          console.error(err);
        });
    }
    handleOpenModal();
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 mt-10 flex items-center justify-between">
        <h1 className="text-xl font-bold">Liste des clients</h1>
        <ButtonFlow
          gradientDuoTone="purpleToBlue"
          className="rounded-full"
          onClick={handleOpenModal}
        >
          <Plus className="mr-2 h-5 w-5" />
          <span>{isEditing ? "Modifier le client" : "Ajouter un client"}</span>
        </ButtonFlow>
      </div>
      <div className="mb-4">
        <TextInput
          type="text"
          placeholder="Rechercher un client par nom ou email"
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Nom</Table.HeadCell>
          <Table.HeadCell>Prénom</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Date de Naissance</Table.HeadCell>
          <Table.HeadCell>Téléphone</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {clients.map((client) => (
            <Table.Row
              key={client.idClient}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {client.nomClient}
              </Table.Cell>
              <Table.Cell>{client.prenomClient}</Table.Cell>
              <Table.Cell>{client.email}</Table.Cell>
              <Table.Cell>{client.dateNaissance}</Table.Cell>
              <Table.Cell>{client.telephone}</Table.Cell>
              <Table.Cell>
                <ButtonFlow size="xs" onClick={() => handleEdit(client)}>
                  Modifier
                </ButtonFlow>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="mt-4 flex justify-center">
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal for Adding/Editing Client */}
      <Modal show={openModal} onClose={handleOpenModal} size="lg" popup>
        <Modal.Header>
          {isEditing ? "Modifier le client" : "Ajouter un client"}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label htmlFor="nomClient" value="Nom" />
              <TextInput
                id="nomClient"
                value={clientData.nomClient}
                onChange={(e) => handleChange("nomClient", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="prenomClient" value="Prénom" />
              <TextInput
                id="prenomClient"
                value={clientData.prenomClient}
                onChange={(e) => handleChange("prenomClient", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                value={clientData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateNaissance" value="Date de Naissance" />
              <TextInput
                id="dateNaissance"
                type="date"
                value={clientData.dateNaissance}
                onChange={(e) => handleChange("dateNaissance", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="telephone" value="Téléphone" />
              <TextInput
                id="telephone"
                value={clientData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonFlow color="gray" onClick={handleOpenModal}>
            Annuler
          </ButtonFlow>
          <ButtonFlow onClick={handleSubmit}>
            {isEditing ? "Modifier" : "Ajouter"}
          </ButtonFlow>
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
}

export default Clients;
