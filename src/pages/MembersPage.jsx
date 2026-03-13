import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuUserPlus } from "react-icons/lu";
import RegistryTable from "../components/RegistryTable";
import {
  listMembers,
  createHead,
  updateMember,
  deleteMember,
  listFamilies,
  listWards,
  listGrades,
  updateHead,
} from "../api/registryServices";

const MembersPage = () => {
  const navigate = useNavigate();
  const [wards, setWards] = useState([]);
  const [families, setFamilies] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [wRes, fRes, gRes] = await Promise.all([
          listWards(),
          listFamilies(),
          listGrades(),
        ]);
        setWards(wRes.data || []);
        setFamilies(fRes.data || []);
        setGrades(gRes.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const headFields = [
    {
      name: "family",
      label: "Family",
      type: "select",
      required: true,
      options: families.map((f) => ({ value: f.id, label: f.family_name })),
      coerce: Number,
    },
    {
      name: "ward",
      label: "Ward",
      type: "select",
      required: true,
      options: wards.map((w) => ({ value: w.id, label: w.ward_name })),
      coerce: Number,
    },
    { name: "house_name", label: "House Name", required: true },
    { name: "name", label: "Name", required: true },
    { name: "baptismal_name", label: "Baptismal Name" },
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
    {
      name: "family_image",
      label: "Family Image",
      type: "file",
      fullWidth: true,
    },
  ];

  const extraActions = [
    {
      icon: LuUserPlus,
      title: "Add Members",
      color: "green.500",
      hoverColor: "green.700",
      onClick: (item) => {
        // Navigate to add members for this head
        navigate(`/members/${item.id}`, { state: { head: item } });
      },
    },
  ];

  // We filter to show only those who are likely heads or just all members if the API lists everyone.
  // The user request says "list all head" and "each head have its own members".
  // Usually, a "head" might be identified by relationship or a flag.
  // But the "Create Head" API suggests we are creating heads here.
  // If listMembers returns all, we might need to filter.
  // However, for now I'll list all and let the user see.

  const handleUpdateHead = async (id, formData) => {
    // 1. Prepare data
    let ward, familyId, memberData;
    if (formData instanceof FormData) {
      ward = formData.get("ward");
      familyId = formData.get("family");
      memberData = formData;
    } else {
      const { ward: w, family: f, ...rest } = formData;
      ward = w;
      familyId = f;
      memberData = rest;
    }

    // 2. Call updateHead (handles Ward and other fields)
    const hRes = await updateHead(id, formData);

    // 3. Call updateMember (specifically for Family field which updateHead ignores)
    if (familyId) {
      // If it was FormData, we don't want to resend the whole file again if possible,
      // but simple JSON update for family should work.
      await updateMember(id, { family: Number(familyId) });
    }

    return hRes;
  };

  const listHeadsWithNames = async () => {
    // Fetch fresh options to ensure names are correct after an update
    const [wRes, fRes, mRes] = await Promise.all([
      listWards(),
      listFamilies(),
      listMembers(),
    ]);

    const freshWards = wRes.data || [];
    const freshFamilies = fRes.data || [];
    const allMembers = mRes.data || [];

    // Filter for heads
    const heads = allMembers.filter((m) => !m.relationship);

    // Map names
    const mapped = heads.map((h) => {
      const familyObj = freshFamilies.find(
        (f) => f.id === (h.family?.id || h.family),
      );
      const wardObj = freshWards.find((w) => w.id === (h.ward?.id || h.ward));
      return {
        ...h,
        family_name: h.family?.family_name || familyObj?.family_name || "N/A",
        ward_name: h.ward?.ward_name || wardObj?.ward_name || "N/A",
      };
    });

    return { ...mRes, data: mapped };
  };

  return (
    <RegistryTable
      title="Member Information"
      addLabel="Create Head"
      nameKey="name"
      columnLabel="Head of Family"
      emptyMessage="No members found."
      listFn={listHeadsWithNames}
      createFn={createHead}
      updateFn={handleUpdateHead}
      deleteFn={deleteMember}
      fields={headFields}
      extraActions={extraActions}
    />
  );
};

export default MembersPage;
