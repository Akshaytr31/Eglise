import React, { useState, useEffect } from "react";
import RegistryTable from "../components/RegistryTable";
import {
  listFamilies,
  createFamily,
  updateFamily,
  deleteFamily,
  listWards,
} from "../api/registryServices";

const FamilyPage = () => {
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await listWards();
        setWards(res.data || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    };
    fetchWards();
  }, []);

  const familyFields = [
    { name: "family_name", label: "Family Name", required: true },
    {
      name: "ward",
      label: "Ward",
      type: "select",
      options: wards.map((w) => ({ value: w.id, label: w.ward_name })),
      coerce: Number,
    },
    { name: "origin", label: "Origin" },
    {
      name: "history",
      label: "History",
      type: "textarea",
      rows: 3,
      fullWidth: true,
    },
  ];

  const familyColumns = [
    { header: "Family Name", key: "family_name", textAlign: "left" },
    {
      header: "Ward",
      key: "ward_name",
      textAlign: "center",
    },
  ];

  // Helper to map ward ID to name in list
  const listFamiliesWithWardName = async () => {
    const res = await listFamilies();
    if (res.data && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map((f) => {
          const wardObj = wards.find((w) => w.id === (f.ward?.id || f.ward));
          return {
            ...f,
            ward_name: f.ward?.ward_name || wardObj?.ward_name || "N/A",
          };
        }),
      };
    }
    return res;
  };

  return (
    <RegistryTable
      title="Family"
      addLabel="Add New"
      nameKey="family_name"
      columns={familyColumns}
      emptyMessage="No families found."
      listFn={listFamiliesWithWardName}
      createFn={createFamily}
      updateFn={updateFamily}
      deleteFn={deleteFamily}
      fields={familyFields}
    />
  );
};

export default FamilyPage;
