import { getReservationByNumero } from "@/pages/locations/reservations_service";
import { getVehiculeByMatricule } from "@/pages/vehicules/vehicules_service";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "flowbite-react";
import { getClientById } from "@/pages/clients/clients_service";
import { HiOutlinePrinter } from "react-icons/hi";
import "./css_invoice.css";

const Invoice = () => {
  const { numReservation, idClient, matricule } = useParams();
  const [reservation, setReservation] = useState({});
  const [vehicule, setVehicule] = useState({});
  const [client, setClient] = useState({});
  const [duree, setDuree] = useState();

  useEffect(() => {
    getReservationByNumero(numReservation).then((res) => {
      const calculateDuree = () => {
        const timeDiff = Math.abs(
          new Date(res.data.reservation.dateFin) -
            new Date(res.data.reservation?.dateDebut),
        );
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDuree(diffDays);
      };

      calculateDuree();

      setReservation(res.data.reservation);
    });
    getClientById(idClient).then((res) => {
      setClient(res.data.client);
    });
    getVehiculeByMatricule(matricule).then((res) => {
      setVehicule(res.data.vehicule);
    });
  }, [numReservation, idClient, matricule]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto mt-3 max-w-3xl rounded border-2 border-gray-300 bg-white p-8 shadow-lg">
      {/* Print Button */}
      <div className="mb-4 flex justify-end">
        <Button onClick={handlePrint}>
          <HiOutlinePrinter className="mr-2 h-5 w-5" />
          Imprimer la facture
        </Button>
      </div>

      {/* En-tête */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          {/* <img
            src="your-logo.png"
            alt="Logo de l'entreprise"
            className="h-12"
          /> */}
          <h1 className="mt-2 text-2xl font-bold">LocaBile</h1>
          <p className="text-sm">1234 Adresse Rue, Casablanca, Maroc</p>
          <p className="text-sm">Email : contact@LocaBile.com</p>
          <p className="text-sm">Téléphone : +212 688-711066</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold">Facture</h2>
          <p className="mt-2">Facture n° : {reservation.numReservation}</p>
          <p>Date de facture : {new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </header>

      {/* Facturer à */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold">Facturer à :</h3>
        <p>
          {client.nomClient} {client.prenomClient}
        </p>
        <p>Email : {client.email}</p>
        <p>Téléphone : {client.telephone}</p>
      </section>

      {/* Tableau de la facture */}
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Durée</Table.HeadCell>
            <Table.HeadCell>Prix Unitaire</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {vehicule.marque} {vehicule.nomVehicule} ({vehicule.modele})
              </Table.Cell>
              <Table.Cell>{reservation ? duree : ""}</Table.Cell>
              <Table.Cell>{vehicule.prixLocation?.toFixed(2)} DH</Table.Cell>
              <Table.Cell>{vehicule.prixLocation?.toFixed(2)} DH</Table.Cell>
            </Table.Row>
            {/* Ajouter d'autres lignes si nécessaire */}
          </Table.Body>
        </Table>
      </div>

      {/* Résumé */}
      <div className="mt-8 text-right">
        <p className="mb-2">
          <strong>Sous-total :</strong> {vehicule.prixLocation?.toFixed(2)} DH
        </p>
        {/* <p className="mb-2">
          <strong>Taxe (10%) :</strong>{" "}
          {(vehicule.prixLocation * 0.1).toFixed(2)} DH
        </p> */}
        <p className="mb-2">
          <strong>Remise :</strong> -
          {reservation.discount?.toFixed(2) || "0.00"} %
        </p>
        <p className="text-2xl font-bold">
          Total : {reservation.montant?.toFixed(2)} DH
        </p>
      </div>

      {/* Pied de page */}
    </div>
  );
};

export default Invoice;
