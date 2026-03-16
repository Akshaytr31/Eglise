import React from "react";
import RegistryTable from "../components/RegistryTable";
import {
  listPriests,
  createPriest,
  updatePriest,
  deletePriest,
} from "../api/registryServices";

const PRIEST_FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
  },
  {
    name: "house_name",
    label: "House Name",
    type: "text",
    required: true,
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    required: true,
  },
];

const PRIEST_COLUMNS = [
  { header: "Name", key: "name", textAlign: "left" },
  { header: "House Name", key: "house_name", textAlign: "left" },
  { header: "Address", key: "address", textAlign: "left" },
];

const PriestPage = () => (
  <RegistryTable
    title="Priest Master"
    addLabel="Add Priest"
    nameKey="name"
    columns={PRIEST_COLUMNS}
    emptyMessage="No priests found."
    listFn={listPriests}
    createFn={createPriest}
    updateFn={updatePriest}
    deleteFn={deletePriest}
    fields={PRIEST_FIELDS}
  />
);

export default PriestPage;
