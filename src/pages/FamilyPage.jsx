import React from "react";
import RegistryTable from "../components/RegistryTable";
import FamilyFormModal from "../components/FamilyFormModal";
import {
  listFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
} from "../api/registryServices";

const FamilyPage = () => {
  return (
    <RegistryTable
      title="Family Directory"
      addLabel="Add New Family"
      nameKey="family_name"
      columnLabel="Family Name"
      emptyMessage="No families found."
      dataPropName="familyData"
      listFn={listFamilies}
      createFn={createFamily}
      updateFn={updateFamily}
      deleteFn={deleteFamily}
      FormModal={FamilyFormModal}
    />
  );
};

export default FamilyPage;
