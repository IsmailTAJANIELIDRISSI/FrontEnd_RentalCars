import React, { useState, useEffect } from "react";
import {
  Table,
  TextInput,
  Pagination,
  Modal,
  Button as ButtonFlow,
  Label,
  Textarea,
  HR,
  List,
  Avatar as AvatarFlow,
  Datepicker,
} from "flowbite-react";
import { getReclamation, addReclamation } from "./reclamation_service"; // Assurez-vous d'avoir la fonction addReclamation dans votre service
import { Plus } from "lucide-react";
import ModalMessage from "@/widgets/modals/ModalMessage"; // Si vous avez ce composant pour les messages de succès/erreur
import { CiSearch } from "react-icons/ci";
import { MdDelete, MdTaxiAlert } from "react-icons/md";
import {
  Avatar,
  Card,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { getClientss } from "@/services/clients_service";
import {
  getVehicules,
  getVehiculesByCriteria,
} from "../vehicules/vehicules_service";
import Loading from "@/widgets/loading/Loading";

const Reclamations = () => {
  const [reclamations, setReclamations] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [filteredVehicules, setFilteredVehicules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(false);
  const [showVehiculeList, setShowVehiculeList] = useState(false);
  const reclamationsPerPage = 10;

  const [openModal, setOpenModal] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newReclamation, setNewReclamation] = useState({
    description: "",
    matriculeVehicule: "",
    idClient: null,
    dateReclamation: "",
  });
  const [client, setClient] = useState(null);
  const [vehicule, setVehicule] = useState(null);

  const [clientQuery, setClientQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [clients, setClients] = useState([]);
  const [showClientList, setShowClientList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchAllData = async () => {
      try {
        const [reclamationsResponse, clientsResponse, vehiculesResponse] =
          await Promise.all([
            getReclamation(searchTerm, reclamationsPerPage, currentPage),
            getClientss(),
            getVehiculesByCriteria(),
          ]);

        setReclamations(reclamationsResponse.data.data);
        setTotalPages(reclamationsResponse.data.last_page);
        setClients(clientsResponse.data.clients);
        setFilteredClients(clientsResponse.data.clients);
        setVehicules(vehiculesResponse.data.vehiculesNotReserved);
        setFilteredVehicules(vehiculesResponse.data.vehiculesNotReserved);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [searchTerm, currentPage, reload]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await getReclamation(
  //         searchTerm,
  //         reclamationsPerPage,
  //         currentPage,
  //       );
  //       setReclamations(res.data.data);
  //       setTotalPages(res.data.last_page);
  //     } catch (error) {
  //       console.error("Error fetching reclamations:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getClientss()
  //     .then((res) => {
  //       setClients(res.data.clients);
  //       setFilteredClients(res.data.clients);
  //     })
  //     .catch((err) => {})
  //     .finally(() => {
  //       setLoading(false);
  //     });

  //   const fetchVehicules = async () => {
  //     try {
  //       const res = await getVehiculesByCriteria();
  //       setVehicules(res.data.vehiculesNotReserved);
  //       setFilteredVehicules(res.data.vehiculesNotReserved);
  //       // setPhotos(res.data.photos);

  //       // const updatedVehicules = res.data.vehiculesNotReserved.map(
  //       //   (vehicule) => {
  //       //     // Filter the photos array to find photos that match the vehicle's matricule
  //       //     const matchingPhotos = res.data.photos.filter(
  //       //       (photo) => photo.matricule === vehicule.matricule,
  //       //     );

  //       //     // Assign the matching photos to the vehicle
  //       //     return {
  //       //       ...vehicule,
  //       //       photos: matchingPhotos,
  //       //     };
  //       //   },
  //       // );
  //       // setVehicules(updatedVehicules);
  //     } catch (error) {
  //       console.error("Error fetching vehicules:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  //   fetchVehicules();
  // }, [searchTerm, currentPage, reload]);

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
    if (
      !newReclamation.description ||
      !newReclamation.matriculeVehicule ||
      !client ||
      !newReclamation.dateReclamation
    ) {
      setErrorMessage("Veuillez remplir tous les champs.");
      setOpenModalError(true);
      return;
    }
    addReclamation(newReclamation)
      .then((res) => {
        setErrorMessage("");
        setOpenModalError(false);
        setSuccessMessage("Réclamation ajoutée avec succès !");
        setOpenModalSuccess(true);
        setNewReclamation({
          description: "",
          matriculeVehicule: "",
          idClient: null,
          dateReclamation: "",
        });
        setClient(null);
        setVehicule(null);
        setClientQuery("");
        setSearchQuery("");
        handleOpenModal();
        setReload(!reload);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          setErrorMessage(errorMessages.join("\n"));
        } else {
          setErrorMessage(
            "Une erreur s'est produite lors de l'ajout de la réclamation.",
          );
        }
        setOpenModalError(true);
        console.error(err);
      });
  };

  const handleClientSearchInput = (e) => {
    const query = e.target.value;

    setClientQuery(query);
    setFilteredClients(
      clients.filter(
        (client) =>
          client.nomClient.toLowerCase().includes(query.toLowerCase()) ||
          client.prenomClient.toLowerCase().includes(query.toLowerCase()) ||
          client.telephone.includes(query) ||
          client.email.toLowerCase().includes(query.toLowerCase()) ||
          `${client.nomClient} ${client.prenomClient}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    );
  };

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = vehicules.filter(
      (vehicule) =>
        vehicule.nomVehicule.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.modele.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.marque.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.matricule.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.typeCarburant.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.modeBoite.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.typeAssurance.toLowerCase().includes(query.toLowerCase()) ||
        vehicule.puissance == query ||
        vehicule.nbrSiege == query ||
        vehicule.prixLocation == query ||
        vehicule.prixLocation == query,
    );
    setFilteredVehicules(filtered);
  };

  const handleClientSelect = (client) => {
    setNewReclamation((prev) => ({
      ...prev,
      idClient: client.idClient,
    }));

    setClient(client);
    setShowClientList(false);
    setClientQuery(`${client.nomClient} ${client.prenomClient}`);
  };

  const handleVehiculeSelect = (vehicule) => {
    setVehicule(vehicule);
    setNewReclamation({
      ...newReclamation,
      matriculeVehicule: vehicule.matricule,
    });
    setShowVehiculeList(false);
    setSearchQuery(`${vehicule.nomVehicule} - ${vehicule.modele}`);
  };

  const handleDeleteClient = () => {
    setClient(null);
    setClientQuery("");
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
                className="mr-2 rounded"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearch}
                icon={CiSearch}
              />
              <ButtonFlow
                className=" flex items-center gap-3"
                color={"failure"}
                pill
                onClick={handleOpenModal}
                disabled={loading}
              >
                <Plus className="mr-2 h-5 w-5" />
                {/* <MdTaxiAlert className="mr-2 h-5 w-5"/> */}
                <span>Ajouter une réclamation</span>
              </ButtonFlow>
            </div>
          </div>
        </div>
      </CardHeader>
      {loading ? (
        <Loading />
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Date de Réclamation</Table.HeadCell>
            <Table.HeadCell>Client</Table.HeadCell>
            <Table.HeadCell>Matricule du Véhicule</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {
              /* </Table.Row> */
              reclamations.length === 0 ? (
                // Render a message when no reclamations are available
                <Table.Row>
                  <Table.Cell colSpan={4} className="p-4 text-center">
                    Aucune réclamation trouvée.
                  </Table.Cell>
                </Table.Row>
              ) : (
                reclamations.map((reclamation) => (
                  <Table.Row
                    key={reclamation.idReclamation}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {reclamation.dateReclamation}
                    </Table.Cell>
                    <Table.Cell>
                      {reclamation.nomClient} - {reclamation.prenomClient}
                    </Table.Cell>
                    <Table.Cell>{reclamation.matriculeVehicule}</Table.Cell>
                    <Table.Cell>{reclamation.description}</Table.Cell>
                  </Table.Row>
                ))
              )
            }
          </Table.Body>
        </Table>
      )}
      <CardFooter className="border-t border-blue-gray-200 bg-blue-gray-50 p-4">
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
      <Modal show={openModal} onClose={handleOpenModal} popup>
        <Modal.Header className="p-4">Ajouter une réclamation</Modal.Header>
        <HR className="mt-0 pt-0" />
        <Modal.Body>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
                  <div className="mt-1 max-h-40 overflow-y-auto">
                    {filteredVehicules?.length > 0 ? (
                      filteredVehicules.map((vehicule, index) => (
                        <div
                          key={index}
                          className="flex cursor-pointer items-center space-x-4 rounded border p-2 hover:bg-gray-100 rtl:space-x-reverse"
                          onClick={() => handleVehiculeSelect(vehicule)}
                        >
                          <AvatarFlow
                            img={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                            alt="avatar"
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
                        Aucun véhicule disponible.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {vehicule && (
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
                        <Table.Cell>{vehicule.matricule}</Table.Cell>
                        <Table.Cell className="">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                              alt={vehicule.nomVehicule}
                              variant="rounded"
                              withBorder={true}
                              className="p-0.5"
                              color="blue-gray"
                              size="md"
                              // className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                            />
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {vehicule.nomVehicule}
                            </Typography>
                          </div>
                        </Table.Cell>
                        <Table.Cell>{vehicule.marque}</Table.Cell>
                        <Table.Cell>{vehicule.modele}</Table.Cell>
                        <Table.Cell>
                          {vehicule.prixLocation} DH / Jour
                        </Table.Cell>
                        <Table.Cell>
                          <MdDelete
                            onClick={() => {
                              setVehicule(null);
                              setNewReclamation({
                                ...newReclamation,
                                matriculeVehicule: null,
                              });
                              setSearchQuery("");
                            }}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                            size={20}
                          />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </div>
              )}
              <div className="col-span-2">
                <div className="mb-2 block">
                  <Label
                    htmlFor="dateReclamation"
                    value="Date de Réclamation"
                  />
                </div>
                <Datepicker
                  labelTodayButton="Aujourd'hui"
                  labelClearButton="Effacer"
                  id="dateDebut"
                  defaultDate={new Date()}
                  minDate={new Date()}
                  language="fr"
                  name="dateDebut"
                  onSelectedDateChanged={(date) => {
                    setNewReclamation({
                      ...newReclamation,
                      dateReclamation: date,
                    });
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* Full-width Client input */}
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
                              img={`http://127.0.0.1:8042/storage/files/vehicules/photos/${client.photo}`}
                              alt={client.nomClient}
                              rounded
                              size="sm"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white">
                              {client.nomClient[0]}
                              {client.prenomClient[0]}
                            </div>
                          )}
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-gray-800">
                              {client.nomClient} {client.prenomClient}
                            </p>
                            <p className="text-xs leading-none text-gray-500">
                              {client.email}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        Aucun client trouvé.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Selected Client */}
            {client && (
              <div className="flex items-center justify-between rounded border bg-gray-50 p-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  {!client.photo ? (
                    <Avatar
                      img={`http://127.0.0.1:8042/storage/files/clients/photos/${client.photo}`}
                      alt={client.nomClient}
                      rounded
                      size="lg"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-500 text-white">
                      {client.nomClient[0]}
                      {client.prenomClient[0]}
                    </div>
                  )}

                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-800">
                      {client.nomClient} {client.prenomClient}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {client.email}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {client.telephone}
                    </p>
                  </div>
                </div>
                <ButtonFlow
                  color="light"
                  pill
                  size="xs"
                  onClick={handleDeleteClient}
                >
                  <MdDelete className="text-lg text-gray-500 text-red-500" />
                </ButtonFlow>
              </div>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Textarea
                id="description"
                value={newReclamation.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                placeholder="Description de la réclamation..."
                required
              />
            </div>
          </div>
        </Modal.Body>
        <HR className="m-0 mt-2 pt-0" />
        <Modal.Footer className="flex justify-end">
          <ButtonFlow color="light" onClick={handleOpenModal}>
            Annuler
          </ButtonFlow>
          <ButtonFlow color="failure" onClick={handleSubmit}>
            Enregistrer
          </ButtonFlow>
        </Modal.Footer>
      </Modal>
      {/* Modal for Success and Error Messages */}
      <ModalMessage
        show={openModalSuccess || openModalError}
        onClose={() => {
          setOpenModalSuccess(false);
          setOpenModalError(false);
        }}
        isSuccess={openModalSuccess}
        error={openModalError}
        message={errorMessage || successMessage}
      />
    </Card>
  );
};

export default Reclamations;
