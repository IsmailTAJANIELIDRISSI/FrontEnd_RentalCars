import React, { useState, useEffect } from "react";
import {
  Table,
  TextInput,
  Pagination,
  Modal,
  Button as ButtonFlow,
  Label,
  Card,
  Tooltip,
  HR,
  Datepicker,
} from "flowbite-react";
import { addClient, editClient, getClients } from "./clients_service";
import { Plus } from "lucide-react";
import ModalMessage from "@/widgets/modals/ModalMessage";
import { CiSearch } from "react-icons/ci";
import { CardHeader, IconButton, Typography } from "@material-tailwind/react";
import { IoPersonAdd } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { format } from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GiReturnArrow } from "react-icons/gi";
import Loading from "@/widgets/loading/Loading";

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
  const [loading, setLoading] = useState(true);
  // const [open, setOpen] = useState(null);

  const [clientData, setClientData] = useState({
    nomClient: "",
    prenomClient: "",
    email: "",
    dateNaissance: "",
    telephone: "",
  });

  const navigate = useNavigate();

  const location = useLocation();

  // Access the 'open' value from the state
  const { open } = location.state || false;

  useEffect(() => {
    if (open) {
      setOpenModal(true);
    }
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await getClients(searchTerm, currentPage);
        setClients(res.data.data || []);
        setTotalPages(res.data.last_page || 1); // Utilisation d'une valeur par défaut
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
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

  const handleBackToReservation = () => {
    setOpenModal(false);
    navigate("/dashboard/reservations");
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
            "Une erreur s'est produite lors de la modification du client.",
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
            "Une erreur s'est produite lors de l'ajout du client.",
          );
          setOpenModalError(true);
          console.error(err);
        });
    }
    handleOpenModal();
  };

  return (
    <Card className="mt-10 h-full w-full ">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 mt-1 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Liste des clients
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
                disabled={loading}
              />
              <ButtonFlow
                className=" flex items-center gap-3"
                pill
                onClick={handleOpenModal}
              >
                <IoPersonAdd className="mr-2 h-4 w-4" />
                <span>Ajouter un client</span>
              </ButtonFlow>
            </div>
          </div>
        </div>
      </CardHeader>

      {loading ? (
        <Loading />
      ) : clients.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p>Aucun client n'est disponible au ce moment</p>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Nom</Table.HeadCell>
            <Table.HeadCell>Prénom</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Date de Naissance</Table.HeadCell>
            <Table.HeadCell>Téléphone</Table.HeadCell>
            <Table.HeadCell className="text-center">Actions</Table.HeadCell>
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
                <Table.Cell className="flex justify-center">
                  <Tooltip content="Modifier">
                    <IconButton
                      onClick={() => handleEdit(client)}
                      variant="text"
                    >
                      <FaUserEdit className="ml-1 h-6 w-6 text-orange-400" />
                    </IconButton>
                  </Tooltip>
                  {/* <ButtonFlow pill size="xs">
                  <FaUserEdit className="ml-1 h-6 w-6 text-orange-400" />
                </ButtonFlow> */}
                  {/* <ButtonFlow size="xs" onClick={() => handleEdit(client)}>
                  Modifier
                </ButtonFlow> */}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <div className="mt-4 flex justify-center">
        {totalPages > 0 && (
          <Pagination
            showIcons
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal for Adding/Editing Client */}
      <Modal show={openModal} onClose={handleOpenModal} size="2xl" popup>
        <Modal.Header className="p-4">
          {isEditing ? "Modifier le client" : "Ajouter un client"}
        </Modal.Header>
        <HR className="mt-0 pt-0" />
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nomClient" value="Nom" />
              </div>
              <TextInput
                id="nomClient"
                value={clientData.nomClient}
                onChange={(e) => handleChange("nomClient", e.target.value)}
                placeholder="Entrez le nom "
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="prenomClient" value="Prénom" />
              </div>
              <TextInput
                id="prenomClient"
                value={clientData.prenomClient}
                onChange={(e) => handleChange("prenomClient", e.target.value)}
                placeholder="Entrez le prénom "
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dateNaissance" value="Date de Naissance" />
              </div>
              <Datepicker
                labelTodayButton="Aujourd'hui"
                labelClearButton="Effacer"
                id="dateDebut"
                defaultDate={
                  isEditing ? new Date(clientData.dateNaissance) : new Date()
                }
                maxDate={new Date()}
                language="fr"
                name="dateNaissance"
                onSelectedDateChanged={(date) => {
                  setClientData({
                    ...clientData,
                    dateNaissance: format(date, "yyyy-MM-dd"),
                  });

                  // setDefaultDateFin(addDays(date, 1));
                }}
                // value={reservation.dateDebut || ""}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="telephone" value="Téléphone" />
              </div>
              <TextInput
                id="telephone"
                value={clientData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                placeholder="Entrez le numéro de téléphone"
              />
            </div>
            <div className="col-span-2">
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                icon={HiMail}
                value={clientData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="exemple@domaine.com"
              />
            </div>
          </div>
        </Modal.Body>
        <HR className="m-0 mt-2 pt-0" />
        <Modal.Footer className="flex justify-between">
          {open ? (
            <div className="flex justify-center">
              <Tooltip
                content="Retourner à la liste des resérvation"
                animation="duration-1000"
                arrow={false}
              >
                <ButtonFlow
                  color="dark"
                  className="flex items-center gap-3"
                  pill
                  outline
                  size="sm"
                  onClick={handleBackToReservation}
                >
                  {/* <IoPersonAdd className="h-5 w-5" /> */}
                  <GiReturnArrow className="h-5 w-5" />
                </ButtonFlow>
              </Tooltip>
            </div>
          ) : (
            <div className="flex justify-center"></div>
          )}
          <div className="flex gap-2">
            <ButtonFlow color="gray" onClick={handleOpenModal}>
              Annuler
            </ButtonFlow>
            <ButtonFlow
              onClick={handleSubmit}
              disabled={
                !clientData.dateNaissance ||
                !clientData.email ||
                !clientData.telephone ||
                !clientData.nomClient ||
                !clientData.prenomClient
              }
            >
              {isEditing ? "Modifier" : "Ajouter"}
            </ButtonFlow>
          </div>
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
}

export default Clients;
