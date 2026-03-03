import React from "react";
import RegistryTable from "../components/RegistryTable";
import BaptismFormModal from "../components/BaptismFormModal";
import {
  listBaptisms,
  createBaptism,
  updateBaptism,
  deleteBaptism,
} from "../api/registryServices";

const BaptismPage = () => {
  return (
    <RegistryTable
      title="Baptism Register"
      addLabel="Add Record"
      nameKey="name"
      columnLabel="Person Name"
      emptyMessage="No baptism records found."
      listFn={listBaptisms}
      createFn={createBaptism}
      updateFn={updateBaptism}
      deleteFn={deleteBaptism}
      FormModal={BaptismFormModal}
    />
  );
};

export default BaptismPage;
