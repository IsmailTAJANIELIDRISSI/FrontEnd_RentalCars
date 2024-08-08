import React from "react";
import { Modal, Button } from "flowbite-react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

const ModalMessage = ({ show, onClose, message, isSuccess }) => {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          {isSuccess ? (
            <HiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500 dark:text-green-400" />
          ) : (
            <HiXCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-400" />
          )}
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center gap-4">
            <Button color={isSuccess ? "green" : "red"} onClick={onClose}>
              Ok
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalMessage;
