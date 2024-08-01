"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";

export function Component() {
  const [openModal, setOpenModal] = useState(true);

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500 dark:text-green-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Action completed successfully!
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="green" onClick={() => setOpenModal(false)}>
                Ok
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
