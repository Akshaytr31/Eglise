import React from "react";
import RegistryTable from "../components/RegistryTable";
import {
  listFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
} from "../api/registryServices";

const familyFields = [
  { name: "family_name", label: "Family Name", required: true },
  { name: "origin", label: "Origin" },
  { name: "history", label: "History", type: "textarea", rows: 3 },
];

const FamilyPage = () => {
  return (
    <RegistryTable
      title="Family"
      addLabel="Add New"
      nameKey="family_name"
      columnLabel="Family Name"
      emptyMessage="No families found."
      listFn={listFamilies}
      createFn={createFamily}
      updateFn={updateFamily}
      deleteFn={deleteFamily}
      fields={familyFields}
    />
  );
};

export default FamilyPage;
