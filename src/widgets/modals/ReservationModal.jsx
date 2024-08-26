import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Label,
  TextInput,
  Table,
  List,
  Datepicker,
  Select,
} from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { getVehiculesByCriteria } from "@/pages/vehicules/vehicules_service";
import { getClients } from "@/services/clients_service";
import { addDays } from "date-fns";
import ModalMessage from "./ModalMessage";
import { Avatar } from "@material-tailwind/react";
import { statutExpeditionOptions } from "@/environment";

export function ReservationModal({
  open,
  onClose,
  isEditing,
  reservationData,
  onSave,
}) {
  const [reservation, setReservation] = useState(
    reservationData || {
      dateDebut: new Date(),
      duree: 1,
      dateFin: addDays(new Date(), 1),
      statutExpedition: "À préparer",
    },
  );
  const [vehicules, setVehicules] = useState([]);
  const [filteredVehicules, setFilteredVehicules] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showVehiculeList, setShowVehiculeList] = useState(false);
  const [showClientList, setShowClientList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientQuery, setClientQuery] = useState("");
  const [openModalError, setOpenModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [reload, setReload] = useState(false);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    console.log(reservationData);
    console.log(reservation);

    if (reservation.dateDebut && reservation.dateFin && reservation.duree) {
      getVehiculesByCriteria(
        searchQuery,
        reservation.dateDebut,
        reservation.dateFin,
      )
        .then((res) => {
          const vehiculesData = res.data?.vehiculesNotReserved || [];
          setVehicules(vehiculesData);
          setFilteredVehicules(vehiculesData);
          setShowSearch(true);
          setReservation({ ...reservation, vehicule: null });
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
  }, [reservation.dateDebut, reservation.dateFin, reservation.duree, reload]);

  useEffect(() => {
    getClients()
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
  }, []);

  const handleDateFin = (e) => {
    const dateDebut = reservation.dateDebut;
    if (e.target?.name === "duree") {
      const dateFin = addDays(dateDebut, +e.target.value);
      setReservation({ ...reservation, dateFin, duree: +e.target.value });
    } else {
      const dateFin = addDays(e, reservation.duree);
      setReservation({ ...reservation, dateFin, dateDebut: e });
    }
  };

  const handleInputChange = (e) => {
    setReservation({
      ...reservation,
      [e.target.name]:
        e.target.name === "duree" ? +e.target.value : e.target.value,
    });
  };

  const handleVehiculeSelect = (vehicule) => {
    setReservation({ ...reservation, vehicule });
    calculateTotal(
      vehicule,
      reservation.dateDebut,
      reservation.dateFin,
      reservation.remise,
    );
    setShowVehiculeList(false);
    setSearchQuery("");
  };

  const handleClientSelect = (client) => {
    setReservation({ ...reservation, client });
    setShowClientList(false);
    setClientQuery("");
  };

  const handleDeleteVehicule = () => {
    setReservation({ ...reservation, vehicule: null, total: "" });
  };

  const handleDeleteClient = () => {
    setReservation({ ...reservation, client: null });
  };

  const handleSave = () => {
    if (
      !reservation.vehicule ||
      !reservation.client ||
      !reservation.lieuPrise ||
      !reservation.lieuRecuperation
    ) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      setOpenModalError(true);
      return;
    }
    setReload(!reload);
    onSave(reservation);
    setVehicules([]);
    setReservation({ ...reservation, client: null, vehicule: null });
    // onClose();
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
    setClientQuery(e.target.value);
    const filtered = clients.filter(
      (client) =>
        client.nomClient.toLowerCase().includes(e.target.value.toLowerCase()) ||
        client.prenomClient
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
    );
    setFilteredClients(filtered);
  };

  const calculateTotal = (vehicule, dateDebut, dateFin, remise) => {
    let total = vehicule?.prixLocation * reservation.duree;
    if (remise) {
      total -= (total * remise) / 100;
    }
    setReservation((prev) => ({
      ...prev,
      total: vehicule ? total.toFixed(2) : 0.0,
    }));
  };

  useEffect(() => {
    calculateTotal(
      reservation.vehicule,
      reservation.dateDebut,
      reservation.dateFin,
      reservation.remise,
    );
  }, [
    reservation.dateDebut,
    reservation.dateFin,
    reservation.remise,
    reservation.vehicule,
  ]);

  return (
    <Modal show={open} onClose={onClose} popup>
      <Modal.Header className="p-4">
        {isEditing ? "Modifier la réservation" : "Ajouter une réservation"}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="dateDebut" value="Date de début" />
            <Datepicker
              id="dateDebut"
              defaultDate={new Date()}
              minDate={new Date()}
              language="fr"
              name="dateDebut"
              onSelectedDateChanged={(date) => {
                handleDateFin(date);
                // setDefaultDateFin(addDays(date, 1));
              }}
              // value={reservation.dateDebut || ""}
            />
          </div>

          <div>
            <Label htmlFor="dateFin" value="Durée" />
            <Select
              name="duree"
              required
              onChange={(e) => {
                // handleInputChange(e);
                handleDateFin(e);
              }}
            >
              {days.map((day) => (
                <option key={+day} value={day}>
                  {day} jours
                </option>
              ))}
            </Select>
          </div>

          {showSearch && (
            <div>
              <Label htmlFor="vehicule" value="Véhicule" />
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
          {reservation.vehicule && (
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
                    <Table.Cell>
                      <a
                        href="#"
                        className="text-blue-500 hover:underline"
                        onClick={() =>
                          handleMatriculeClick(reservation.vehicule.matricule)
                        }
                      >
                        {reservation.vehicule.matricule}
                      </a>
                    </Table.Cell>
                    <Table.Cell className="">
                      <div className="mr-5 flex items-center gap-3">
                        {/* <img
                          src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                          alt={reservation.vehicule.nomVehicule}
                          className="h-12 w-12 rounded-md"
                        /> */}
                        <Avatar
                          src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                          alt={reservation.vehicule.nomVehicule}
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
                        <span>{reservation.vehicule.nomVehicule}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{reservation.vehicule.marque}</Table.Cell>
                    <Table.Cell>{reservation.vehicule.modele}</Table.Cell>
                    <Table.Cell>
                      {reservation.vehicule.prixLocation} DH / Jour
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
            <Label htmlFor="client" value="Client" />
            <TextInput
              id="client"
              name="client"
              placeholder="Rechercher un client"
              icon={CiSearch}
              required
              onChange={handleClientSearchInput}
              value={clientQuery}
              onFocus={() => setShowClientList(true)}
              //   onBlur={() => setShowClientList(false)}
            />
            {showClientList && (
              <div className="mt-2 max-h-40 overflow-y-auto">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client, index) => (
                    // <div
                    //   key={client.id}
                    //   className="flex cursor-pointer items-center space-x-2 rounded border p-2 hover:bg-gray-100"
                    //   onClick={() => handleClientSelect(client)}
                    // >
                    //   <span>{`${client.nomClient} ${client.prenomClient}`}</span>
                    // </div>
                    <div
                      key={index}
                      className="flex cursor-pointer items-center space-x-4 rounded border p-2 hover:bg-gray-100 rtl:space-x-reverse"
                      onClick={() => handleClientSelect(client)}
                    >
                      {!client.photo ? (
                        <Avatar
                          src={`http://127.0.0.1:8042/storage/files/clients/photos/${client.photo}`}
                          alt={client.nomClient}
                          rounded
                          size="sm"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
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

          {reservation.client && (
            <div className="mt-6">
              <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                Client sélectionné
              </h4>
              {/* <Table>
                <Table.Head>
                  'nomClient', 'prenomClient', 'photo', 'email',
                  'dateNaissance', 'telephone' 
                  <Table.HeadCell>Nom Complet</Table.HeadCell>
                  <Table.HeadCell>Nom Complet</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                  <Table.HeadCell>Date de naissance</Table.HeadCell>
                  <Table.HeadCell>Telephone</Table.HeadCell>
                  <Table.HeadCell>Action</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <a
                        href="#"
                        className="text-blue-500 hover:underline"
                        onClick={() =>
                          handleMatriculeClick(reservation.vehicule.matricule)
                        }
                      >
                        {reservation.vehicule.matricule}
                      </a>
                    </Table.Cell>
                    <Table.Cell className="">
                      <div className="mr-5 flex items-center gap-3">
                        <img
                          src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                          alt={reservation.vehicule.nomVehicule}
                          className="h-12 w-12 rounded-md"
                        />
                        <span>{reservation.vehicule.nomVehicule}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{reservation.vehicule.marque}</Table.Cell>
                    <Table.Cell>{reservation.vehicule.modele}</Table.Cell>
                    <Table.Cell>
                      {reservation.vehicule.prixLocation} DH / Jour
                    </Table.Cell>
                    <Table.Cell>
                      <MdDelete
                        onClick={handleDeleteVehicule}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table> */}
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
                    {!reservation.client.photo ? (
                      <Avatar
                        src={`http://127.0.0.1:8042/storage/files/vehicules/photos/dacia.jpg`}
                        alt={reservation.client.nomClient}
                        rounded
                        size="sm"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                        {reservation.client.nomClient[0]}
                        {reservation.client.prenomClient[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {reservation.client.nomClient} -{" "}
                        {reservation.client.prenomClient}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {reservation.client.email}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {reservation.client.telephone}
                    </div>
                  </div>
                </List.Item>
              </List>
            </div>
          )}

          <div>
            <Label htmlFor="lieuPrise" value="Lieu de prise" />
            <TextInput
              id="lieuPrise"
              name="lieuPrise"
              placeholder="Lieu de prise"
              onChange={handleInputChange}
              value={reservation.lieuPrise || ""}
            />
          </div>

          <div>
            <Label htmlFor="lieuRecuperation" value="Lieu de récupération" />

            <TextInput
              id="lieuRecuperation"
              name="lieuRecuperation"
              placeholder="Lieu de récupération"
              onChange={handleInputChange}
              value={reservation.lieuRecuperation || ""}
            />
          </div>

          <div>
            <Label htmlFor="statutExpedition" value="Statut d'expédition" />

            <Select
              id="statutExpedition"
              value={reservation.statutExpedition}
              onChange={handleInputChange}
              name="statutExpedition"
            >
              {statutExpeditionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="remise" value="Remise (%)" />
            <TextInput
              id="remise"
              name="remise"
              type="number"
              placeholder="Entrez une remise"
              onChange={(e) =>
                setReservation({
                  ...reservation,
                  remise: parseFloat(e.target.value) || 0,
                })
              }
              value={reservation.remise || ""}
            />
          </div>

          <div>
            <Label htmlFor="montant" value="Montant total (DH)" />
            <TextInput
              id="montant"
              name="montant"
              placeholder="Montant total"
              disabled
              value={reservation.total || ""}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button color="gray" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={handleSave}>Ajouter</Button>
      </Modal.Footer>
      {/* Error Modal */}
      <ModalMessage
        show={openModalError}
        onClose={() => setOpenModalError(false)}
        isSuccess={false}
        message={errorMessage}
      />
    </Modal>
  );
}
