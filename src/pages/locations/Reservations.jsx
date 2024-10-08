import { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { IoPersonAdd } from "react-icons/io5";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import {
  Datepicker,
  Label,
  Button as ButtonFlow,
  Modal,
  Pagination,
  TextInput,
  Select,
  Table,
  List,
} from "flowbite-react";
import {
  addReservation,
  getReservationsByCriteria,
  updateReservation,
} from "./reservations_service";
import { ReservationModal } from "@/widgets/modals/ReservationModal";
import ModalMessage from "@/widgets/modals/ModalMessage";
import { addDays, format } from "date-fns";
import { CiSearch } from "react-icons/ci";
import {
  getVehiculeByMatricule,
  getVehiculesByCriteria,
} from "../vehicules/vehicules_service";
import { MdAssignmentAdd, MdDelete } from "react-icons/md";
import { getClientss } from "@/services/clients_service";
import { statutExpeditionOptions } from "@/environment";
import { HiOutlinePrinter } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { getClientById } from "../clients/clients_service";
import Loading from "@/widgets/loading/Loading";

// Define the table headers in French
const TABLE_HEAD = [
  "Numéro de réservation",
  "Véhicule",
  "Client",
  // "Statut du paiement",
  "Statut d'expédition",
  "Total",
  "Action",
];

export default function Reservations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1); // To keep track of total pages
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchReservations = async () => {
      try {
        const response = await getReservationsByCriteria(
          searchTerm,
          10,
          currentPage,
        );
        setReservations(response.data.data);
        setTotalPages(response.data.last_page); // Assuming 'last_page' is provided in the API response
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [currentPage, searchTerm, reload]);

  const onPageChange = (page) => setCurrentPage(page);
  const handleAddReservation = () => {
    setIsEditing(false);
    setSelectedReservation(null);
    setOpenModal(true);
  };

  const handleEditReservation = (reservation) => {
    setIsEditing(true);
    setSelectedReservation(reservation);
    setOpenEditModal(true);
  };

  const handleSaveReservation = (reservation) => {
    if (isEditing) {
      // Update reservation logic if editing
      updateReservation(reservation, reservation.numReservation)
        .then((res) => {
          setSuccessMessage("Reservation modifié avec succès !");
          setOpenModalSuccess(true);
          setOpenEditModal(false);
          setReload(!reload);
        })
        .catch(() => {
          setErrorMessage(
            "Une erreur s'est produite lors de modification du réservation.",
          );
          setOpenModalError(true);
        });
    } else {
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
    }
  };

  const handleAddClient = () => {
    navigate("/dashboard/clients", { state: { open: true } });
  };

  const EditReservationModal = ({ open, onClose, reservationData, onSave }) => {
    const [dateDebut, setDateDebut] = useState(
      reservationData
        ? new Date(reservationData.dateDebut).getTime() < new Date().getTime()
          ? new Date()
          : new Date(reservationData.dateDebut)
        : new Date(),
    );
    const [dateFin, setDateFin] = useState(
      reservationData ? new Date(reservationData.dateFin) : new Date(),
    );
    const [lieuPrise, setLieuPrise] = useState(
      reservationData ? reservationData.lieuPrise : "",
    );
    const [lieuRecuperation, setLieuRecuperation] = useState(
      reservationData ? reservationData.lieuRecuperation : "",
    );
    const [montant, setMontant] = useState(
      reservationData ? reservationData.montant : 0,
    );
    const [remise, setRemise] = useState(
      reservationData ? reservationData.remise : "",
    );
    const [statutExpedition, setStatutExpedition] = useState(
      reservationData ? reservationData.statutExpedition : "",
    );
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [clientQuery, setClientQuery] = useState("");
    const [showVehiculeList, setShowVehiculeList] = useState(false);
    const [showClientList, setShowClientList] = useState(false);
    const [duree, setDuree] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [vehicules, setVehicules] = useState([]);
    const [clients, setClients] = useState([]);
    const [filteredVehicules, setFilteredVehicules] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState(null);

    const [openModalSuccess, setOpenModalSuccess] = useState(false);
    const [openModalError, setOpenModalError] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [reload, setReload] = useState(false);
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    useEffect(() => {
      if (reservationData) {
        getVehiculeByMatricule(reservationData.matricule).then((res) => {
          setSelectedVehicule(res.data.vehicule);
        });
        getClientById(reservationData.idClient).then((res) => {
          setSelectedClient(res.data.client);
        });

        const calculateDuree = () => {
          const timeDiff = Math.abs(
            dateFin - new Date(reservationData.dateDebut),
          );
          const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          setDuree(diffDays);
        };

        calculateDuree();
        getAllClients();
      }
    }, []);

    const getAllClients = () => {
      getClientss()
        .then((res) => {
          const { clients } = res.data || [];
          setClients(clients);
          setFilteredClients(clients);
        })
        .catch((error) => {
          console.error("Error fetching clients:", error);
          setClients([]);
          setFilteredClients([]);
        });
    };

    useEffect(() => {
      if (dateDebut && dateFin && duree) {
        // handleDateFin();
        getVehiculesByCriteria(
          searchQuery,
          dateDebut,
          dateFin,
          reservationData?.numReservation,
        )
          .then((res) => {
            const vehiculesData = res.data?.vehiculesNotReserved || [];
            setVehicules(vehiculesData);
            setFilteredVehicules(vehiculesData);
            // setSelectedVehicule(null);
            setShowSearch(true);
            // setVehicules([]);
          })
          .catch((error) => {
            console.error("Error fetching vehicles:", error);
            setVehicules([]);
            setFilteredVehicules([]);
            setShowSearch(true);
          });
      } else {
        setShowSearch(false);
      }
    }, [dateDebut, dateFin, duree, reload]);

    const handleDateFin = (param) => {
      let dateFin;
      if (typeof param === "number") {
        dateFin = addDays(dateDebut, param);
      } else {
        dateFin = addDays(param, duree);
      }
      setDateFin(dateFin);
    };

    const handleVehiculeSelect = (vehicule) => {
      setSelectedVehicule(vehicule);
      calculateTotal(vehicule, dateDebut, dateFin, remise);
      setShowVehiculeList(false);
      setSearchQuery("");
    };

    const handleClientSelect = (client) => {
      setSelectedClient(client);
      setShowClientList(false);
      setClientQuery(`${client.nomClient} ${client.prenomClient}`);
    };

    const handleDeleteVehicule = () => {
      setMontant("");
      setSelectedVehicule(null);
    };

    const handleDeleteClient = () => {
      setSelectedClient(null);
    };

    const handleSearchInput = (e) => {
      setSearchQuery(e.target.value);
      const filtered = vehicules.filter(
        (vehicule) =>
          vehicule.nomVehicule
            .toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          vehicule.modele.toLowerCase().includes(e.target.value.toLowerCase()),
      );
      setFilteredVehicules(filtered);
    };

    const handleClientSearchInput = (e) => {
      const query = e.target.value;
      setClientQuery(query);
      const filtered = clients.filter(
        (client) =>
          client.nomClient.toLowerCase().includes(query.toLowerCase()) ||
          client.prenomClient.toLowerCase().includes(query.toLowerCase()) ||
          client.telephone.includes(query) ||
          client.email.toLowerCase().includes(query.toLowerCase()) ||
          `${client.nomClient} ${client.prenomClient}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      );
      setFilteredClients(filtered);
    };

    const calculateTotal = (vehicule, dateDebut, dateFin, remise) => {
      let total = vehicule?.prixLocation * duree;
      if (remise) {
        total -= (total * remise) / 100;
      }
      setMontant(vehicule ? +total.toFixed(2) : 0.0);
    };

    useEffect(() => {
      calculateTotal(selectedVehicule, dateDebut, dateFin, remise);
    }, [dateDebut, dateFin, remise, selectedVehicule]);

    const handleSave = () => {
      if (
        !lieuPrise ||
        !lieuRecuperation ||
        !selectedVehicule ||
        !selectedClient
      ) {
        setErrorMessage("Veuillez remplir tous les champs obligatoires.");
        setOpenModalError(true);
        return;
      }

      const updatedReservation = {
        numReservation: reservationData?.numReservation,
        dateDebut: format(dateDebut, "yyyy-MM-dd"),
        dateFin: format(dateFin, "yyyy-MM-dd"),
        lieuPrise,
        lieuRecuperation,
        montant,
        idClient: selectedClient.idClient,
        matricule: selectedVehicule.matricule,
        remise: remise,
        statutExpedition: statutExpedition,
      };
      onSave(updatedReservation);
      // onSave(updatedReservation)
      //   .then(() => {
      //     setSuccessMessage(
      //       "Reservation modifié avec succès !",
      //     );
      //     onClose();
      //   })
      //   .catch(() => {
      //     setErrorMessage(
      //       "Une erreur s'est produite lors de modification du réservation.",
      //     );
      //   });
    };

    if (!reservationData) {
      return null; // Do not render the modal if reservationData is null
    }

    return (
      <Modal show={open} onClose={onClose}>
        <Modal.Header>Edit Reservation</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dateDebut" value="Date début" />
              </div>
              <Datepicker
                minDate={new Date()}
                language="fr"
                defaultDate={dateDebut}
                onSelectedDateChanged={(date) => {
                  setDateDebut(date);
                  handleDateFin(date);
                }}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="duree" value="Durée" />
              </div>
              <Select
                onChange={(e) => {
                  setDuree(+e.target.value);
                  handleDateFin(+e.target.value);
                }}
                value={duree}
              >
                {days.map((day, index) => (
                  <option value={day} key={index}>
                    {day} jours
                  </option>
                ))}
              </Select>
            </div>

            {showSearch && (
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="vehicule" value="Véhicule" />
                </div>
                <TextInput
                  id="vehicule"
                  name="vehicule"
                  placeholder="Rechercher un véhicule"
                  icon={CiSearch}
                  required
                  onChange={handleSearchInput}
                  value={searchQuery}
                  onFocus={() => setShowVehiculeList(true)}
                />
                {showVehiculeList && (
                  <div className="mt-2 max-h-40 overflow-y-auto ">
                    {filteredVehicules.length > 0 ? (
                      filteredVehicules.map((vehicule, index) => (
                        <div
                          key={index}
                          className="flex cursor-pointer items-center space-x-4 rounded border p-2 hover:bg-gray-100 rtl:space-x-reverse"
                          onClick={() => handleVehiculeSelect(vehicule)}
                        >
                          {/* <Avatar
                          img={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                          alt="Neil image"
                          rounded
                          size="sm"
                        /> */}
                          <Avatar
                            src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                            alt="avatar"
                            variant="rounded"
                            withBorder={true}
                            color="blue-gray"
                            className="p-0.5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {vehicule.nomVehicule} - {vehicule.modele}
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {vehicule.modeBoite}
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            {vehicule.prixLocation} DH / Jour
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-red-500">
                        Aucun véhicule disponible pour ces dates.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Display selected vehicle information in a table */}
            {selectedVehicule && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Véhicule sélectionné
                </h4>
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Matricule</Table.HeadCell>
                    <Table.HeadCell>Photo</Table.HeadCell>
                    <Table.HeadCell>Marque</Table.HeadCell>
                    <Table.HeadCell>Modèle</Table.HeadCell>
                    <Table.HeadCell>Prix Location</Table.HeadCell>
                    <Table.HeadCell>Action</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>{selectedVehicule.matricule}</Table.Cell>
                      <Table.Cell className="">
                        <div className="mr-5 flex items-center gap-3">
                          {/* <img
                          src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                          alt={reservation.vehicule.nomVehicule}
                          className="h-12 w-12 rounded-md"
                        /> */}
                          <Avatar
                            src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                            alt={selectedVehicule.nomVehicule}
                            variant="rounded"
                            withBorder={true}
                            className="p-0.5"
                            color="blue-gray"
                          />
                          {/* <Avatar
                        bordered
                        size="lg"
                        img="http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg"
                      /> */}
                          <span>{selectedVehicule.nomVehicule}</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{selectedVehicule.marque}</Table.Cell>
                      <Table.Cell>{selectedVehicule.modele}</Table.Cell>
                      <Table.Cell>
                        {selectedVehicule.prixLocation} DH / Jour
                      </Table.Cell>
                      <Table.Cell>
                        <MdDelete
                          onClick={handleDeleteVehicule}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          size={20}
                        />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            )}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="client" value="Client" />
              </div>
              <TextInput
                id="client"
                name="client"
                placeholder="Rechercher un client"
                icon={CiSearch}
                required
                onChange={handleClientSearchInput}
                value={clientQuery}
                onFocus={() => setShowClientList(true)}
              />
              {showClientList && (
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((client, index) => (
                      <div
                        key={index}
                        className="flex cursor-pointer items-center space-x-4 rounded border p-2 hover:bg-gray-100 rtl:space-x-reverse"
                        onClick={() => handleClientSelect(client)}
                      >
                        {client.photo ? (
                          <Avatar
                            src={`http://127.0.0.1:8042/storage/files/clients/photos/${client.photo}`}
                            alt={client.nomClient}
                            rounded="true"
                            size="sm"
                          />
                        ) : (
                          // <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                          //   {client.nomClient[0]}
                          //   {client.prenomClient[0]}
                          // </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white">
                            {client.nomClient[0]}
                            {client.prenomClient[0]}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {client.nomClient} - {client.prenomClient}
                          </p>
                          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                            {client.email}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {client.telephone}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-red-500">Aucun client trouvé.</div>
                  )}
                </div>
              )}
            </div>

            {selectedClient && (
              <div className="mt-6">
                <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                  Client sélectionné
                </h4>
                <List
                  unstyled
                  className="max-w-md divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <List.Item className="pb-3 sm:pb-4">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <button onClick={handleDeleteClient}>
                        <MdDelete
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          size={20}
                        />
                      </button>
                      {selectedClient.photo ? (
                        <Avatar
                          src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                          alt={selectedClient.nomClient}
                          rounded="true"
                          size="sm"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white">
                          {selectedClient.nomClient[0]}
                          {selectedClient.prenomClient[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {selectedClient.nomClient} -{" "}
                          {selectedClient.prenomClient}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {selectedClient.email}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        {selectedClient.telephone}
                      </div>
                    </div>
                  </List.Item>
                </List>
              </div>
            )}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="lieuPrise" value="Lieu prise en charge" />
              </div>
              <TextInput
                id="lieuPrise"
                value={lieuPrise}
                onChange={(e) => setLieuPrise(e.target.value)}
                placeholder="Lieu de prise"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="lieuRecuperation"
                  value="Lieu de récupération"
                />
              </div>
              <TextInput
                id="lieuRecuperation"
                value={lieuRecuperation}
                onChange={(e) => setLieuRecuperation(e.target.value)}
                placeholder="Lieu de récupération"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="statutExpedition" value="Statut d'expédition" />
              </div>

              <Select
                id="statutExpedition"
                value={statutExpedition}
                onChange={(e) => setStatutExpedition(e.target.value)}
                name="statutExpedition"
              >
                {statutExpeditionOptions.map((option, index) => (
                  <option
                    key={index}
                    value={option}
                    selected={option === statutExpedition}
                  >
                    {option}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="remise" value="Remise (%)" />
              </div>
              <TextInput
                id="remise"
                name="remise"
                type="number"
                placeholder="Entrez une remise"
                onChange={(e) => setRemise(parseFloat(e.target.value) || 0)}
                value={remise || ""}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="montant" value="Total " />
              </div>
              <TextInput
                id="montant"
                value={montant}
                onChange={(e) => setMontant(+e.target.value)}
                disabled
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <ButtonFlow color="gray" onClick={onClose}>
            Annuler
          </ButtonFlow>
          <ButtonFlow
            color="purple"
            onClick={handleSave}
            disabled={!selectedVehicule || !selectedClient}
          >
            Enregistrer les changements
          </ButtonFlow>
        </Modal.Footer>

        <ModalMessage
          message={successMessage}
          isSuccess={true}
          show={openModalSuccess}
          onClose={() => setOpenModalSuccess(false)}
        />
        <ModalMessage
          message={errorMessage}
          isSuccess={false}
          show={openModalError}
          onClose={() => setOpenModalError(false)}
        />
      </Modal>
    );
  };

  return (
    <Card className="mt-10 h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 mt-1 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Liste des réservations
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="flex w-full gap-2">
              <TextInput
                type="text"
                value={searchTerm}
                className="mr-2 rounded"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                // icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                icon={CiSearch}
                disabled={loading}
              />
              <ButtonFlow
                className="flex items-center gap-3"
                color="dark"
                pill
                // size="sm"
                onClick={handleAddClient}
              >
                <IoPersonAdd className="mr-2 h-4 w-4" />
                Ajouter un client
              </ButtonFlow>
              <ButtonFlow
                onClick={handleAddReservation}
                className="ml-2 flex items-center gap-3"
                color={"purple"}
                pill
              >
                <MdAssignmentAdd className="mr-2 h-4 w-4" />
                Ajouter une réservation
              </ButtonFlow>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto px-0 pt-0">
        {loading ? (
          <Loading />
        ) : reservations.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p>Aucun resérvation n'est disponible au ce moment</p>
          </div>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${
                      head === "Action" ? "text-center" : ""
                    }`}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => {
                const isLast = index === reservations.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {reservation.numReservation}
                      </Typography>
                    </td>
                    <td className={`${classes}`}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                            reservation.photo
                              ? `http://127.0.0.1:8042/storage/files/vehicules/photos/${reservation.photo}`
                              : `http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`
                          }
                          alt={"ee"}
                          // size="md"
                          variant="rounded"
                          // className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                        />

                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {reservation.nomVehicule}
                        </Typography>
                      </div>
                    </td>
                    <td>
                      {/* <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {prenomClient} {nomClient}
                      </Typography> */}
                      <div className="flex items-center gap-4">
                        {!reservation.photo ? (
                          <Avatar
                            src={`http://127.0.0.1:8042/storage/files/clients/photos/${reservation.photo}`}
                            alt={reservation.nomClient}
                            rounded="true"
                            size="sm"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                            {reservation.nomClient[0]}
                            {reservation.prenomClient[0]}
                          </div>
                        )}
                        {/* <Avatar
                          src="https://docs.material-tailwind.com/img/face-2.jpg"
                          alt="avatar"
                          size="md"
                        /> */}
                        <div>
                          <Typography variant="h6">
                            {reservation.nomClient} {reservation.prenomClient}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="font-normal"
                          >
                            {reservation.telephone}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    {/* <td className={classes}>
                    <Chip
                      size="sm"
                      variant="ghost"
                      // value={reservation?.paymentStatut}
                      color={
                        reservation?.paymentStatut === "paid"
                          ? "green"
                          : reservation?.paymentStatut === "pending"
                          ? "amber"
                          : "red"
                      }
                    />
                  </td> */}
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={reservation?.statutExpedition}
                          color={
                            reservation?.statutExpedition === "À préparer"
                              ? "blue-gray"
                              : reservation?.statutExpedition ===
                                "En préparation"
                              ? "amber"
                              : reservation?.statutExpedition ===
                                "Prêt à être livré"
                              ? "teal"
                              : reservation?.statutExpedition ===
                                "En cours de livraison"
                              ? "blue"
                              : reservation?.statutExpedition === "Livré"
                              ? "green"
                              : reservation?.statutExpedition ===
                                "En attente de retour"
                              ? "red"
                              : reservation?.statutExpedition === "Récupéré"
                              ? "purple"
                              : "gray"
                          }
                        />
                      </div>
                    </td>

                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {reservation.montant} DH
                      </Typography>
                    </td>
                    <td className={`${classes} text-center`}>
                      <Tooltip content="Modifier">
                        <IconButton
                          variant="text"
                          onClick={() => handleEditReservation(reservation)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Imprimer">
                        <Link
                          to={`/invoice/${reservation.numReservation}/${reservation.idClient}/${reservation.matricule}`}
                        >
                          <IconButton variant="text">
                            <HiOutlinePrinter className="h-5 w-5" />
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardBody>
      <CardFooter className=" border-t border-blue-gray-200 bg-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          {reservations.length} résultats trouvés
        </Typography>
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            onPageChange={onPageChange}
            showIcons
            totalPages={totalPages}
          />
        </div>
      </CardFooter>
      <ReservationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveReservation}
      />
      <EditReservationModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        reservationData={selectedReservation}
        onSave={handleSaveReservation}
      />
      <ModalMessage
        message={successMessage}
        isSuccess={true}
        show={openModalSuccess}
        onClose={() => setOpenModalSuccess(false)}
      />
      <ModalMessage
        message={errorMessage}
        isSuccess={false}
        show={openModalError}
        onClose={() => setOpenModalError(false)}
      />
    </Card>
  );
}
