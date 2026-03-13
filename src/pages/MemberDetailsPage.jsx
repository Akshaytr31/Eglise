import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import RegistryTable from "../components/RegistryTable";
import {
  listFamilyMembers,
  createMember,
  updateMember,
  deleteMember,
  listRelationships,
  listGrades,
  listFamilies,
} from "../api/registryServices";

const MemberDetailsPage = () => {
  const { headId } = useParams();
  const location = useLocation();
  const [head, setHead] = useState(location.state?.head || null);
  const [familyId, setFamilyId] = useState(
    head?.family?.id ?? head?.family ?? null,
  );

  const [relationships, setRelationships] = useState([]);
  const [grades, setGrades] = useState([]);
  const [families, setFamilies] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchOptionsAndHead = async () => {
      try {
        const promises = [listRelationships(), listGrades(), listFamilies()];

        let fetchedHead = head;
        if (!fetchedHead) {
          const hRes = await getMember(headId);
          fetchedHead = hRes.data;
          setHead(fetchedHead);
          const f = fetchedHead?.family;
          setFamilyId(f?.id ?? f ?? null);
        } else {
          const f = fetchedHead?.family;
          setFamilyId(f?.id ?? f ?? null);
        }

        const [rRes, gRes, fRes] = await Promise.all(promises);
        setRelationships(rRes.data || []);
        setGrades(gRes.data || []);
        setFamilies(fRes.data || []);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching options or head:", error);
      }
    };
    fetchOptionsAndHead();
  }, [headId]);

  const memberFields = [
    {
      name: "family",
      label: "Family",
      type: "select",
      required: true,
      options: families.map((f) => ({ value: f.id, label: f.family_name })),
      coerce: Number,
    },
    { name: "name", label: "Name", required: true },
    { name: "baptismal_name", label: "Baptismal Name" },
    {
      name: "relationship",
      label: "Relationship",
      type: "select",
      required: true,
      options: relationships.map((r) => ({
        value: r.id,
        label: r.name,
      })),
      coerce: Number,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: [
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
        { value: "OTHER", label: "Other" },
      ],
    },
    { name: "email", label: "Email", type: "email" },
    {
      name: "marital_status",
      label: "Marital Status",
      type: "select",
      options: [
        { value: "SINGLE", label: "Single" },
        { value: "MARRIED", label: "Married" },
        { value: "WIDOWED", label: "Widowed" },
        { value: "DIVORCED", label: "Divorced" },
      ],
    },
    { name: "spouse_name", label: "Spouse Name" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "mobile_no", label: "Mobile No", required: true },
    { name: "phone_no", label: "Phone No" },
    { name: "blood_group", label: "Blood Group" },
    { name: "father_name", label: "Father Name" },
    { name: "mother_name", label: "Mother Name" },
    { name: "date_of_baptism", label: "Date of Baptism", type: "date" },
    { name: "parish_of_baptism", label: "Parish of Baptism" },
    { name: "educational_qualification", label: "Educational Qualification" },
    {
      name: "sunday_school_qualification",
      label: "Sunday School Qualification",
    },
    { name: "profession", label: "Profession" },
    {
      name: "grade",
      label: "Grade",
      type: "select",
      options: grades.map((g) => ({ value: g.id, label: g.name })),
      coerce: Number,
    },
    { name: "joining_date", label: "Joining Date", type: "date" },
    { name: "transferred_from", label: "Transferred From" },
    { name: "address", label: "Address", type: "textarea", fullWidth: true },
  ];

  const handleCreateMember = (formData) => {
    const data = {
      ...formData,
      family: familyId,
      house_name: head?.house_name,
      is_active: true,
    };
    return createMember(data);
  };

  if (!isDataLoaded) return null;

  const listFamilyMembersStrict = async () => {
    const res = await listFamilyMembers(familyId);
    if (res.data && Array.isArray(res.data)) {
      // familyId is always a plain integer now
      const filtered = res.data.filter(
        (m) =>
          (m.family?.id ?? m.family) === familyId && m.id !== Number(headId),
      );

      if (filtered.length > 0) {
        console.log("[MemberDetailsPage] sample member:", filtered[0]);
        console.log("[MemberDetailsPage] relationships list:", relationships);
      }
      const mapped = filtered.map((m) => {
        const relId =
          typeof m.relationship === "object"
            ? Number(m.relationship?.id)
            : Number(m.relationship);
        const relObj = relationships.find((r) => Number(r.id) === relId);
        return {
          ...m,
          relationship_name: m.relationship?.name || relObj?.name || "—",
        };
      });

      return { ...res, data: mapped };
    }
    return res;
  };

  const memberColumns = [
    { header: "Name", key: "name" },
    { header: "Relationship", key: "relationship_name" },
  ];

  return (
    <RegistryTable
      title={`Members of ${head?.name || "Family"}`}
      addLabel="Add Member"
      nameKey="name"
      columnLabel="Member Name"
      emptyMessage="No family members found."
      listFn={listFamilyMembersStrict}
      createFn={handleCreateMember}
      updateFn={updateMember}
      deleteFn={deleteMember}
      fields={memberFields}
      columns={memberColumns}
    />
  );
};

export default MemberDetailsPage;
