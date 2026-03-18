import React from "react";
import RegistryTable from "../components/RegistryTable";
import BaptismFormModal from "../components/BaptismFormModal";
import {
  listBaptisms,
  createBaptism,
  updateBaptism,
  deleteBaptism,
} from "../api/registryServices";

const BAPTISM_COLUMNS = [
  { header: "Reg No", key: "register_number" },
  { header: "Date", key: "date_of_baptism" },
  { header: "Category", key: "baptism_category" },
  { header: "Gender", key: "gender" },
];

const BaptismPage = () => {
  return (
    <RegistryTable
      title="Baptism Register"
      addLabel="Add Record"
      nameKey="name"
      columns={BAPTISM_COLUMNS}
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
