import React from "react";
import RegistryTable from "../components/RegistryTable";
import {
  listWards,
  createWard,
  updateWard,
  deleteWard,
} from "../api/registryServices";

const WARD_FIELDS = [
  { name: "ward_name", label: "Ward Name", type: "text", required: true },
  {
    name: "ward_number",
    label: "Ward Number",
    type: "number",
    required: true,
    coerce: Number,
  },
  { name: "place", label: "Place", type: "text" },
];

const WardPage = () => (
  <RegistryTable
    title="Ward Directory"
    addLabel="Add New Ward"
    nameKey="ward_name"
    columnLabel="Ward Name"
    emptyMessage="No wards found."
    listFn={listWards}
    createFn={createWard}
    updateFn={updateWard}
    deleteFn={deleteWard}
    fields={WARD_FIELDS}
  />
);

export default WardPage;
