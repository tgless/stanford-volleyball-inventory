import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Shirt,
  Volleyball,
  Smartphone,
  Tent,
  Briefcase,
  Award,
  FileDown,
  PackageSearch,
  Boxes,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://teyaxjprsosbpwkhqqio.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRleWF4anByc29zYnB3a2hxcWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDE1NzcsImV4cCI6MjA5MTQxNzU3N30.vtC-H7s8Mf8sV-I0NiMM2Q5dSpqcizGNnGl2oDjRpY0";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const APP_TABS = ["Inventory", "Add Item"];
const STANFORD_CARDINAL = "#8c1515";
const GIVEAWAY_CATEGORY = "Giveaway Jerseys";

const CATEGORIES = [
  "Apparel",
  "Camp",
  GIVEAWAY_CATEGORY,
  "Gym Equipment",
  "Tech Equipment",
  "Travel/Recovery Equipment",
];

const APPAREL_SIZES = [
  "XXL",
  "XL",
  "L",
  "M",
  "S",
  "Y-XL",
  "Y-L",
  "Y-S",
  "Onesie",
];

const COLOR_OPTIONS = ["Black", "Cardinal Red", "Grey", "Red", "White", "Other"];
const ADD_NEW_LOCATION_VALUE = "__ADD_NEW_LOCATION__";

const STANDARD_EXPORT_MODES = [
  { value: "current", label: "Current screen" },
  { value: "type", label: "By category" },
  { value: "storage", label: "By location" },
];

const APPAREL_EXPORT_MODES = [
  { value: "current", label: "Current screen" },
  { value: "size_type", label: "By size + type" },
  { value: "type", label: "By type" },
  { value: "storage", label: "By storage location" },
];

const JERSEY_EXPORT_MODES = [
  { value: "current", label: "Current screen" },
  { value: "player", label: "By player name" },
  { value: "jersey_number", label: "By jersey #" },
  { value: "color", label: "By color" },
  { value: "storage", label: "By storage location" },
];

const INVENTORY_GROUPS = {
  Apparel: [
    "Baby Onesies",
    "Backpacks",
    "Crewneck Sweatshirts",
    "Hats",
    "Hooded Sweatshirt",
    "Jackets",
    "Long Sleeve T-Shirts",
    "Misc.",
    "T-Shirts",
    "Shoes",
    "Shorts",
  ],
  Camp: ["Balls", "Carts", "First-Aid Supplies", "Misc.", "Tape"],
  [GIVEAWAY_CATEGORY]: [],
  "Gym Equipment": [
    "Antennas",
    "Ball Machines",
    "Ball Pumps",
    "Ball Stops",
    "Balls",
    "Boxes",
    "Carts",
    "Misc.",
    "Nets/Accessories",
    "Poles/Pads",
    "Scoreboards",
    "Setter Targets",
    "Tape",
    "TV's",
  ],
  "Tech Equipment": [
    "Apple TV's/Fire Sticks",
    "Charging Cubes",
    "Cords",
    "Dongles",
    "iPads/iPhones",
    "Microphones",
    "Misc.",
    "Portable Batteries",
    "Routers",
    "Tripods",
  ],
  "Travel/Recovery Equipment": [
    "Athletic Training",
    "Recovery",
    "Misc.",
    "Tech",
  ],
};

const CATEGORY_ICONS = {
  Apparel: Shirt,
  [GIVEAWAY_CATEGORY]: Award,
  "Gym Equipment": Volleyball,
  "Tech Equipment": Smartphone,
  "Travel/Recovery Equipment": Briefcase,
  Camp: Tent,
};

const APPAREL_TYPES = [
  "Baby Onesies",
  "Backpacks",
  "Crewneck Sweatshirts",
  "Hats",
  "Hooded Sweatshirt",
  "Jackets",
  "Long Sleeve T-Shirts",
  "Misc.",
  "T-Shirts",
  "Shoes",
  "Shorts",
  "*Enter New Type",
];

const STORAGE_OPTIONS = {
  Apparel: [
    "Locker Room Storage Room - Bin A1",
    "Locker Room Storage Room - Bin A2",
    "Locker Room Storage Room - Bin A3",
    "Locker Room Storage Room - Bin A4",
    "Locker Room Storage Room - Bin A5",
    "Locker Room Storage Room - Bin A6",
    "Locker Room Storage Room - Bin A7",
    "Locker Room Storage Room - Bin A8",
    "Locker Room Storage Room - Bin B1",
    "Locker Room Storage Room - Bin B2",
    "Locker Room Storage Room - Bin B3",
    "Locker Room Storage Room - Bin B4",
    "Locker Room Storage Room - Bin E1",
    "Locker Room Storage Room - Bin E2",
    "Locker Room Storage Room - Bin E3",
    "Locker Room Storage Room - Bin E4",
    "Locker Room Storage Room - Bin E5",
    "Locker Room Storage Room - Bin E6",
    "Locker Room Storage Room - Bin E7",
    "Locker Room A/V Closet - Upper Cabinets",
    "Locker Room A/V Closet - Lower Cabinets",
    "VB Office Suite",
    "KH Office",
    "MJ/RC Office",
    "TG/WB Office",
  ],
  [GIVEAWAY_CATEGORY]: [
    "Locker Room Closet - Bin 1",
    "Locker Room Closet - Bin 2",
    "Locker Room Closet - Bin 3",
    "Locker Room Closet - Bin 4",
  ],
  "Gym Equipment": [
    "APG Closets",
    "Maples Closet",
    "Locker Room",
    "Ford - Closet",
    "Ford - A/V",
    "VB Suite - Offices",
  ],
  "Tech Equipment": [
    "APG",
    "Maples",
    "Locker Room Lounge",
    "Locker Room A/V Closet - Upper Cabinets",
    "Locker Room A/V Lower Cabinets",
    "Ford - Closet",
    "Ford - A/V",
    "VB Suite",
    "KH Office",
    "MJ/RC Office",
    "TG/WB Office",
    "Small Tech Kit",
    "Large Tech Kit",
    "TV Storage",
  ],
  "Travel/Recovery Equipment": [
    "Annex - Tyler Friedrich",
    "APG Closets",
    "Ford - A/V",
    "Ford - Closet",
    "Locker Room A/V Closet",
    "Locker Room - Closet",
    "Maples Closet",
    "TG/WB Office",
    "Training Room - Molly Sicard",
    "VB Suite",
  ],
  Camp: [
    "APG Closets",
    "Ford - Closet",
    "Maples Closet",
    "Locker Room Storage Room - Bin A1",
    "Locker Room Storage Room - Bin A2",
    "Locker Room Storage Room - Bin A3",
    "Locker Room Storage Room - Bin A4",
    "Locker Room Storage Room - Bin A5",
    "Locker Room Storage Room - Bin A6",
    "Locker Room Storage Room - Bin A7",
    "Locker Room Storage Room - Bin A8",
    "Locker Room Storage Room - Bin B1",
    "Locker Room Storage Room - Bin B2",
    "Locker Room Storage Room - Bin B3",
    "Locker Room Storage Room - Bin B4",
    "VB Suite - Offices",
  ],
};

const DEFAULT_FORM = {
  id: null,
  category: "Apparel",
  item_type: "T-Shirts",
  custom_type: "",
  color: "",
  size: "M",
  quantity: 1,
  year: new Date().getFullYear(),
  year_received: new Date().getFullYear(),
  expected_lifespan: "",
  player_name: "",
  jersey_number: "",
  last_year_worn: "",
  storage_location: STORAGE_OPTIONS.Apparel[0],
  custom_storage_location: "",
  notes: "",
  imageFile: null,
  imageUrl: "",
  image_path: null,
};

const DEFAULT_EXPORT_STATE = {
  mode: "current",
  itemType: "T-Shirts",
  size: "M",
  storageLocation: STORAGE_OPTIONS.Apparel[0],
  playerName: "",
  jerseyNumber: "",
  color: "",
};

const DEFAULT_FILTERS = {
  sizes: [],
  colors: [],
  locations: [],
  playerNames: [],
  jerseyNumbers: [],
};

function sortUnique(values) {
  return Array.from(
    new Set(values.filter(Boolean).map((value) => String(value)))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function buildDraftSignature(form) {
  return JSON.stringify({
    category: form.category,
    item_type: form.item_type,
    custom_type: form.custom_type,
    color: form.color,
    size: form.size,
    quantity: form.quantity,
    year: form.year,
    year_received: form.year_received,
    expected_lifespan: form.expected_lifespan,
    player_name: form.player_name,
    jersey_number: form.jersey_number,
    last_year_worn: form.last_year_worn,
    storage_location: form.storage_location,
    custom_storage_location: form.custom_storage_location,
    notes: form.notes,
    hasImage: Boolean(form.imageFile || form.imageUrl || form.image_path),
  });
}

function IconBadge({ Icon, active = false, large = false }) {
  return (
    <div
      style={{
        ...styles.iconBadge,
        ...(large ? styles.iconBadgeLarge : {}),
        ...(active ? styles.iconBadgeActive : {}),
      }}
    >
      <Icon
        size={large ? 34 : 28}
        strokeWidth={2.2}
        style={{ color: active ? "#ffffff" : STANFORD_CARDINAL }}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      {children}
    </label>
  );
}

function MultiSelectField({
  label,
  options,
  selected,
  onChange,
  allLabel = "All",
}) {
  const safeSelected = Array.isArray(selected) ? selected : [];

  function toggleOption(option) {
    if (safeSelected.includes(option)) {
      onChange(safeSelected.filter((value) => value !== option));
    } else {
      onChange([...safeSelected, option]);
    }
  }

  return (
    <div style={styles.filterField}>
      <span style={styles.filterLabel}>{label}</span>
      <div style={styles.multiSelectGrid}>
        <button
          type="button"
          onClick={() => onChange([])}
          style={{
            ...styles.filterChip,
            ...(safeSelected.length === 0 ? styles.filterChipActive : {}),
          }}
        >
          {allLabel}
        </button>
        {options.map((option) => {
          const active = safeSelected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              style={{
                ...styles.filterChip,
                ...(active ? styles.filterChipActive : {}),
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

async function imageUrlToDataUrl(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [appTab, setAppTab] = useState("Inventory");
  const [inventoryCategory, setInventoryCategory] = useState("Apparel");
  const [inventoryGroup, setInventoryGroup] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isDirty, setIsDirty] = useState(false);
  const [exportState, setExportState] = useState(DEFAULT_EXPORT_STATE);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    quantity: "",
    notes: "",
    storage_location: "",
  });

  const initialSignatureRef = useRef(buildDraftSignature(DEFAULT_FORM));

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  function syncDirtyState(nextForm) {
    setIsDirty(buildDraftSignature(nextForm) !== initialSignatureRef.current);
  }

  async function fetchItems() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const mapped = (data || []).map((item) => ({
      ...item,
      imageUrl: item.image_path
        ? supabase.storage
            .from("inventory-images")
            .getPublicUrl(item.image_path).data.publicUrl
        : "",
    }));

    setItems(mapped);
    setLoading(false);
  }

  function getDefaultItemType(category) {
    if (category === GIVEAWAY_CATEGORY) return "";
    return category === "Apparel"
      ? "T-Shirts"
      : INVENTORY_GROUPS[category]?.[0] || "";
  }

  function resetForm(category = "Apparel") {
    const nextForm = {
      ...DEFAULT_FORM,
      category,
      item_type: getDefaultItemType(category),
      size: category === "Apparel" ? "M" : "",
      storage_location: STORAGE_OPTIONS[category][0] || "",
    };

    setForm(nextForm);
    initialSignatureRef.current = buildDraftSignature(nextForm);
    setIsDirty(false);
  }

  function confirmDiscardIfNeeded() {
    if (!isDirty) return true;
    return window.confirm("You have unsaved changes. Leave without saving?");
  }

  function switchAppTab(nextTab) {
    if (nextTab === appTab) return;
    if (!confirmDiscardIfNeeded()) return;
    setAppTab(nextTab);
  }

  function handleCategoryChange(category) {
    if (form.category === category) return;
    if (!confirmDiscardIfNeeded()) return;

    const nextForm = {
      ...DEFAULT_FORM,
      category,
      item_type: getDefaultItemType(category),
      size: category === "Apparel" ? "M" : "",
      storage_location: STORAGE_OPTIONS[category][0] || "",
    };

    setForm(nextForm);
    initialSignatureRef.current = buildDraftSignature(nextForm);
    setIsDirty(false);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((prev) => {
      const nextForm = { ...prev, [name]: value };
      syncDirtyState(nextForm);
      return nextForm;
    });
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => {
      const nextForm = {
        ...prev,
        imageFile: file,
        imageUrl: previewUrl,
      };

      syncDirtyState(nextForm);
      return nextForm;
    });
  }

  async function uploadImage(file) {
    const extension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;
    const filePath = `inventory/${fileName}`;

    const { error } = await supabase.storage
      .from("inventory-images")
      .upload(filePath, file, { upsert: false });

    if (error) throw error;
    return filePath;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isGiveaway = form.category === GIVEAWAY_CATEGORY;
      let imagePath = null;

      if (form.imageFile) {
        imagePath = await uploadImage(form.imageFile);
      } else if (form.image_path) {
        imagePath = form.image_path;
      } else if (form.id) {
        const existing = items.find((item) => item.id === form.id);
        imagePath = existing?.image_path || null;
      }
      const isNewApparelType =
        form.category === "Apparel" && form.item_type === "*Enter New Type";
      const finalItemType = isGiveaway
        ? form.player_name.trim()
        : isNewApparelType
        ? form.custom_type.trim()
        : form.item_type.trim();

      if (!finalItemType) {
        throw new Error(
          isGiveaway
            ? "Please enter a player name."
            : "Please enter an item type."
        );
      }

      const finalStorageLocation =
        form.storage_location === ADD_NEW_LOCATION_VALUE
          ? form.custom_storage_location.trim()
          : form.storage_location;

      if (!finalStorageLocation) {
        throw new Error("Please choose or enter a storage location.");
      }

      const payload = {
        category: form.category,
        item_type: finalItemType,
        custom_type: isNewApparelType ? form.custom_type.trim() : null,
        player_name: isGiveaway ? form.player_name.trim() : null,
        jersey_number: isGiveaway ? form.jersey_number.trim() || null : null,
        last_year_worn: isGiveaway ? Number(form.last_year_worn) || null : null,
        color:
          form.category === "Apparel" || isGiveaway
            ? form.color.trim() || null
            : null,
        size: !isGiveaway ? form.size.trim() || null : null,
        quantity: Number(form.quantity) || 0,
        year: form.category === "Apparel" ? Number(form.year) || null : null,
        year_received:
          form.category !== "Apparel" && !isGiveaway
            ? Number(form.year_received) || null
            : null,
        expected_lifespan:
          form.category !== "Apparel" && form.category !== "Camp" && !isGiveaway
            ? form.expected_lifespan.trim() || null
            : null,
        storage_location: finalStorageLocation,
        notes: form.notes.trim() || null,
        image_path: imagePath,
      };

      if (form.id) {
        const { error } = await supabase
          .from("inventory_items")
          .update(payload)
          .eq("id", form.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("inventory_items")
          .insert(payload);
        if (error) throw error;
      }

      await fetchItems();
      resetForm(form.category);
      setAppTab("Inventory");
      setInventoryCategory(form.category);
      setInventoryGroup(finalItemType);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function startInlineEdit(item) {
    setEditingItemId(item.id);
    setEditDraft({
      quantity: String(item.quantity ?? 0),
      notes: item.notes || "",
      storage_location:
        item.storage_location || STORAGE_OPTIONS[item.category][0],
    });
  }

  function duplicateItem(item) {
    const nextForm = {
      ...DEFAULT_FORM,
      id: null,
      category: item.category,
      item_type:
        item.category === GIVEAWAY_CATEGORY
          ? ""
          : item.category === "Apparel" &&
            APPAREL_TYPES.includes(item.item_type)
          ? item.item_type
          : item.category === "Apparel"
          ? "*Enter New Type"
          : item.item_type || getDefaultItemType(item.category),
      custom_type:
        item.category === "Apparel" && !APPAREL_TYPES.includes(item.item_type)
          ? item.item_type || ""
          : "",
      color: item.color || "",
      size: item.size || (item.category === "Apparel" ? "M" : ""),
      quantity: item.quantity || 1,
      year: item.year || new Date().getFullYear(),
      year_received: item.year_received || new Date().getFullYear(),
      expected_lifespan: item.expected_lifespan || "",
      player_name:
        item.category === GIVEAWAY_CATEGORY
          ? item.player_name || item.item_type || ""
          : "",
      jersey_number: item.jersey_number || "",
      last_year_worn: item.last_year_worn || "",
      storage_location:
        item.storage_location || STORAGE_OPTIONS[item.category][0],
      custom_storage_location: "",
      notes: item.notes || "",
      imageFile: null,
      imageUrl: item.imageUrl || "",
      image_path: item.image_path || null,
    };

    setForm(nextForm);
    initialSignatureRef.current = buildDraftSignature(DEFAULT_FORM);
    setIsDirty(true);
    setAppTab("Add Item");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveInlineEdit(item) {
    try {
      setError("");

      const { error } = await supabase
        .from("inventory_items")
        .update({
          quantity: Number(editDraft.quantity) || 0,
          notes: editDraft.notes.trim() || null,
          storage_location: editDraft.storage_location,
        })
        .eq("id", item.id);

      if (error) throw error;

      setEditingItemId(null);
      await fetchItems();
    } catch (err) {
      setError(err.message || "Unable to update item.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    await fetchItems();
  }

  function updateExportState(name, value) {
    setExportState((prev) => ({ ...prev, [name]: value }));
  }

  const inventoryHomeCards = CATEGORIES.map((category) => ({
    title: category,
    Icon: CATEGORY_ICONS[category],
  }));

  const categoryItems = useMemo(() => {
    return items.filter((item) => item.category === inventoryCategory);
  }, [items, inventoryCategory]);

  const jerseyPlayerGroups = useMemo(() => {
    return sortUnique(
      items
        .filter((item) => item.category === GIVEAWAY_CATEGORY)
        .map((item) => item.player_name || item.item_type)
    );
  }, [items]);

  const dynamicInventoryGroups = useMemo(() => {
    if (inventoryCategory === GIVEAWAY_CATEGORY) {
      return jerseyPlayerGroups;
    }
    return INVENTORY_GROUPS[inventoryCategory] || [];
  }, [inventoryCategory, jerseyPlayerGroups]);

  useEffect(() => {
    if (
      dynamicInventoryGroups.length > 0 &&
      !dynamicInventoryGroups.includes(inventoryGroup)
    ) {
      setInventoryGroup(dynamicInventoryGroups[0]);
    }

    if (
      dynamicInventoryGroups.length === 0 &&
      inventoryCategory === GIVEAWAY_CATEGORY
    ) {
      setInventoryGroup("");
    }
  }, [dynamicInventoryGroups, inventoryCategory, inventoryGroup]);

  useEffect(() => {
    setExportState((prev) => ({
      ...prev,
      mode: "current",
      itemType: dynamicInventoryGroups?.[0] || "",
      playerName:
        inventoryCategory === GIVEAWAY_CATEGORY
          ? jerseyPlayerGroups?.[0] || ""
          : "",
      jerseyNumber: "",
      color: "",
      storageLocation: STORAGE_OPTIONS[inventoryCategory]?.[0] || "",
      size: inventoryCategory === "Apparel" ? "M" : "",
    }));

    setFilters(DEFAULT_FILTERS);
    setEditingItemId(null);
  }, [inventoryCategory, dynamicInventoryGroups, jerseyPlayerGroups]);

  const normalizedGroupNames = useMemo(() => {
    if (inventoryCategory === GIVEAWAY_CATEGORY) return dynamicInventoryGroups;
    return (INVENTORY_GROUPS[inventoryCategory] || []).filter(
      (name) => name !== "Misc."
    );
  }, [inventoryCategory, dynamicInventoryGroups]);

  const availableSizeOptions = useMemo(() => {
    return sortUnique(categoryItems.map((item) => item.size));
  }, [categoryItems]);

  const availableLocationOptions = useMemo(() => {
    return sortUnique([
      ...(STORAGE_OPTIONS[inventoryCategory] || []),
      ...categoryItems.map((item) => item.storage_location),
    ]);
  }, [inventoryCategory, categoryItems]);

  const availableJerseyNumberOptions = useMemo(() => {
    return sortUnique(categoryItems.map((item) => item.jersey_number));
  }, [categoryItems]);

  const availableColorOptions = useMemo(() => {
    return sortUnique([...COLOR_OPTIONS, ...categoryItems.map((item) => item.color)]);
  }, [categoryItems]);

  const activeExportModes = useMemo(() => {
    if (inventoryCategory === GIVEAWAY_CATEGORY) return JERSEY_EXPORT_MODES;
    if (inventoryCategory === "Apparel") return APPAREL_EXPORT_MODES;
    return STANDARD_EXPORT_MODES;
  }, [inventoryCategory]);

  const groupedInventoryItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = item.category === inventoryCategory;
      const searchTerm = search.toLowerCase().trim();

      const itemPlayerName = item.player_name || item.item_type || "";
      const selectedType =
        inventoryCategory === GIVEAWAY_CATEGORY
          ? !inventoryGroup || itemPlayerName === inventoryGroup
          : inventoryGroup === "Misc."
          ? true
          : item.item_type === inventoryGroup;

      const matchesSearch =
        !searchTerm ||
        [
          item.item_type,
          item.player_name,
          item.jersey_number,
          item.color,
          item.size,
          item.storage_location,
          item.notes,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchTerm));

      const matchesSize =
        !filters.sizes.length || filters.sizes.includes(item.size || "");
      const matchesColor =
        !filters.colors.length || filters.colors.includes(item.color || "");
      const matchesLocation =
        !filters.locations.length ||
        filters.locations.includes(item.storage_location || "");
      const matchesPlayerName =
        !filters.playerNames.length || filters.playerNames.includes(itemPlayerName);
      const matchesJerseyNumber =
        !filters.jerseyNumbers.length ||
        filters.jerseyNumbers.includes(String(item.jersey_number || ""));

      if (inventoryCategory === GIVEAWAY_CATEGORY) {
        return (
          matchesCategory &&
          selectedType &&
          matchesSearch &&
          matchesPlayerName &&
          matchesJerseyNumber &&
          matchesColor &&
          matchesLocation
        );
      }

      if (inventoryGroup === "Misc.") {
        return (
          matchesCategory &&
          !normalizedGroupNames.includes(item.item_type) &&
          matchesSearch &&
          matchesSize &&
          matchesColor &&
          matchesLocation
        );
      }

      return (
        matchesCategory &&
        selectedType &&
        matchesSearch &&
        matchesSize &&
        matchesColor &&
        matchesLocation
      );
    });
  }, [
    items,
    inventoryCategory,
    inventoryGroup,
    search,
    filters,
    normalizedGroupNames,
  ]);

  const itemsForExport = useMemo(() => {
    if (exportState.mode === "current") {
      return groupedInventoryItems;
    }

    if (exportState.mode === "size_type") {
      return categoryItems.filter(
        (item) =>
          item.item_type === exportState.itemType &&
          (item.size || "") === exportState.size
      );
    }

    if (exportState.mode === "type") {
      return categoryItems.filter(
        (item) => item.item_type === exportState.itemType
      );
    }

    if (exportState.mode === "player") {
      return categoryItems.filter(
        (item) =>
          (item.player_name || item.item_type) === exportState.playerName
      );
    }

    if (exportState.mode === "jersey_number") {
      return categoryItems.filter(
        (item) =>
          String(item.jersey_number || "") === String(exportState.jerseyNumber)
      );
    }

    if (exportState.mode === "color") {
      return categoryItems.filter(
        (item) => String(item.color || "") === String(exportState.color)
      );
    }

    if (exportState.mode === "storage") {
      return categoryItems.filter(
        (item) => item.storage_location === exportState.storageLocation
      );
    }

    return categoryItems;
  }, [categoryItems, groupedInventoryItems, exportState]);

  const exportTitle = useMemo(() => {
    if (exportState.mode === "current") {
      return `${inventoryCategory}${
        inventoryGroup ? ` - ${inventoryGroup}` : ""
      }`;
    }

    if (exportState.mode === "size_type") {
      return `${inventoryCategory} - ${exportState.size} ${exportState.itemType}`;
    }

    if (exportState.mode === "type") {
      return `${inventoryCategory} - ${exportState.itemType}`;
    }

    if (exportState.mode === "player") {
      return `${inventoryCategory} - ${exportState.playerName || "Player"}`;
    }

    if (exportState.mode === "jersey_number") {
      return `${inventoryCategory} - Jersey #${exportState.jerseyNumber || ""}`;
    }

    if (exportState.mode === "color") {
      return `${inventoryCategory} - ${exportState.color || "Color"}`;
    }

    if (exportState.mode === "storage") {
      return `${inventoryCategory} - ${exportState.storageLocation}`;
    }

    return inventoryCategory;
  }, [inventoryCategory, inventoryGroup, exportState]);

  function exportStorageLocationOnePagePdf() {
    const doc = new jsPDF("l", "mm", "letter");
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = exportTitle || "Storage Location Export";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(140, 21, 21);
    doc.text("Stanford Volleyball Inventory - Storage Location", 8, 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.text(title, 8, 15, { maxWidth: pageWidth - 16 });
    doc.text(`Generated: ${new Date().toLocaleString()}`, 8, 20);

    const rows = itemsForExport.map((item) => {
      if (inventoryCategory === GIVEAWAY_CATEGORY) {
        return [
          item.player_name || item.item_type || "",
          item.jersey_number || "",
          item.color || "",
          String(item.quantity ?? ""),
          String(item.last_year_worn ?? ""),
          item.storage_location || "",
          item.notes || "",
        ];
      }

      return [
        item.item_type || "",
        item.category || "",
        item.size || "",
        item.color || "",
        String(item.quantity ?? ""),
        String(item.year || item.year_received || ""),
        item.storage_location || "",
        item.notes || "",
      ];
    });

    const head =
      inventoryCategory === GIVEAWAY_CATEGORY
        ? [["Player", "Jersey #", "Color", "Qty", "Last Year", "Storage", "Notes"]]
        : [["Item", "Category", "Size", "Color", "Qty", "Year", "Storage", "Notes"]];

    autoTable(doc, {
      startY: 24,
      head,
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [140, 21, 21],
        fontSize: rows.length > 30 ? 5.5 : 6.5,
        cellPadding: 0.8,
      },
      styles: {
        fontSize: rows.length > 30 ? 5.2 : 6.2,
        cellPadding: rows.length > 30 ? 0.65 : 0.9,
        overflow: "linebreak",
        valign: "middle",
        lineWidth: 0.1,
        minCellHeight: rows.length > 30 ? 3 : 4,
      },
      columnStyles:
        inventoryCategory === GIVEAWAY_CATEGORY
          ? {
              0: { cellWidth: 35 },
              1: { cellWidth: 18 },
              2: { cellWidth: 24 },
              3: { cellWidth: 12 },
              4: { cellWidth: 20 },
              5: { cellWidth: 62 },
              6: { cellWidth: pageWidth - 16 - 35 - 18 - 24 - 12 - 20 - 62 },
            }
          : {
              0: { cellWidth: 34 },
              1: { cellWidth: 30 },
              2: { cellWidth: 14 },
              3: { cellWidth: 22 },
              4: { cellWidth: 12 },
              5: { cellWidth: 16 },
              6: { cellWidth: 62 },
              7: { cellWidth: pageWidth - 16 - 34 - 30 - 14 - 22 - 12 - 16 - 62 },
            },
      margin: { top: 24, right: 8, bottom: 8, left: 8 },
      pageBreak: "avoid",
      rowPageBreak: "avoid",
    });

    if (doc.getNumberOfPages() > 1) {
      const compactDoc = new jsPDF("l", "mm", "letter");
      compactDoc.setFont("helvetica", "bold");
      compactDoc.setFontSize(12);
      compactDoc.setTextColor(140, 21, 21);
      compactDoc.text("Stanford Volleyball Inventory - Storage Location", 8, 9);
      compactDoc.setFont("helvetica", "normal");
      compactDoc.setFontSize(7);
      compactDoc.setTextColor(55, 65, 81);
      compactDoc.text(title, 8, 14, { maxWidth: pageWidth - 16 });

      autoTable(compactDoc, {
        startY: 18,
        head:
          inventoryCategory === GIVEAWAY_CATEGORY
            ? [["Player", "#", "Color", "Qty", "Last", "Storage", "Notes"]]
            : [["Item", "Cat.", "Size", "Color", "Qty", "Year", "Storage", "Notes"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [140, 21, 21], fontSize: 5, cellPadding: 0.4 },
        styles: {
          fontSize: 4.8,
          cellPadding: 0.35,
          overflow: "linebreak",
          valign: "middle",
          lineWidth: 0.05,
          minCellHeight: 2.8,
        },
        margin: { top: 18, right: 5, bottom: 5, left: 5 },
        tableWidth: pageWidth - 10,
        pageBreak: "avoid",
        rowPageBreak: "avoid",
      });

      const safeCompactName = title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      compactDoc.save(`${safeCompactName || "storage-location-export"}.pdf`);
      return;
    }

    const safeName = title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    doc.save(`${safeName || "storage-location-export"}.pdf`);
  }

  async function exportPdf() {
    try {
      setExporting(true);
      setError("");

      if (!itemsForExport.length) {
        throw new Error("No items match the selected export options.");
      }

      if (exportState.mode === "storage") {
        exportStorageLocationOnePagePdf();
        return;
      }

      const doc = new jsPDF("p", "mm", "letter");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const totalQuantity = itemsForExport.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      );

      let y = 16;

      // PAGE 1: TABLE + SUMMARY ONLY
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(140, 21, 21);
      doc.text("Stanford Volleyball Inventory Export", 14, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(55, 65, 81);
      doc.text(exportTitle, 14, y);
      y += 6;
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
      y += 8;

      doc.setDrawColor(222, 214, 200);
      doc.setFillColor(255, 253, 250);
      doc.roundedRect(14, y, pageWidth - 28, 15, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text(`Total Items: ${itemsForExport.length}`, 18, y + 6);
      doc.text(`Total Quantity: ${totalQuantity}`, 18, y + 12);
      y += 22;

      if (inventoryCategory === GIVEAWAY_CATEGORY) {
        autoTable(doc, {
          startY: y,
          head: [
            [
              "#",
              "Player",
              "Jersey #",
              "Color",
              "Quantity",
              "Last Year",
              "Storage",
              "Notes",
            ],
          ],
          body: itemsForExport.map((item, index) => [
            String(index + 1),
            item.player_name || item.item_type || "",
            item.jersey_number || "",
            item.color || "",
            String(item.quantity ?? ""),
            String(item.last_year_worn ?? ""),
            item.storage_location || "",
            item.notes || "",
          ]),
          theme: "grid",
          headStyles: { fillColor: [140, 21, 21] },
          styles: { fontSize: 8.2, cellPadding: 1.8, overflow: "linebreak" },
          columnStyles: {
            0: { cellWidth: 9 },
            1: { cellWidth: 30 },
            2: { cellWidth: 18 },
            3: { cellWidth: 22 },
            4: { cellWidth: 18 },
            5: { cellWidth: 22 },
            6: { cellWidth: 44 },
          },
        });
      } else {
        autoTable(doc, {
          startY: y,
          head: [
            [
              "#",
              "Title",
              "Category",
              "Size",
              "Color",
              "Quantity",
              "Storage",
              "Notes",
            ],
          ],
          body: itemsForExport.map((item, index) => [
            String(index + 1),
            item.item_type || "",
            item.category || "",
            item.size || "",
            item.color || "",
            String(item.quantity ?? ""),
            item.storage_location || "",
            item.notes || "",
          ]),
          theme: "grid",
          headStyles: { fillColor: [140, 21, 21] },
          styles: { fontSize: 8.2, cellPadding: 1.8, overflow: "linebreak" },
          columnStyles: {
            0: { cellWidth: 9 },
            1: { cellWidth: 25 },
            2: { cellWidth: 25 },
            3: { cellWidth: 13 },
            4: { cellWidth: 20 },
            5: { cellWidth: 18 },
            6: { cellWidth: 54 },
          },
        });
      }

      // PAGE 2+: PHOTO CARDS ONLY, IN THE SAME ORDER + NUMBERING AS THE TABLE
      doc.addPage();
      y = 16;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(140, 21, 21);
      doc.text("Item Photos", 14, y);
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      doc.text(exportTitle, 14, y, { maxWidth: pageWidth - 28 });
      y += 10;

      const cardColumns = 3;
      const cardsPerPage = 15;
      const cardGapX = 5;
      const cardGapY = 5;
      const cardWidth = (pageWidth - 28 - cardGapX * (cardColumns - 1)) / cardColumns;
      const cardHeight = 48;
      const imageSize = 30;
      const cardFont = 5.1;
      const titleFont = 6.2;
      const pageTopY = 30;
      let cardsOnCurrentPage = 0;

      for (const [index, item] of itemsForExport.entries()) {
        if (cardsOnCurrentPage >= cardsPerPage) {
          doc.addPage();
          y = 16;
          cardsOnCurrentPage = 0;

          doc.setFont("helvetica", "bold");
          doc.setFontSize(16);
          doc.setTextColor(140, 21, 21);
          doc.text("Item Photos", 14, y);
          y = pageTopY;
        }

        const columnIndex = cardsOnCurrentPage % cardColumns;
        const rowIndex = Math.floor(cardsOnCurrentPage / cardColumns);
        const cardX = 14 + columnIndex * (cardWidth + cardGapX);
        const cardY = pageTopY + rowIndex * (cardHeight + cardGapY);

        doc.setDrawColor(222, 214, 200);
        doc.setFillColor(255, 253, 250);
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2.5, 2.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.setTextColor(140, 21, 21);
        doc.text(`#${index + 1}`, cardX + 3, cardY + 4.5);

        const imageData = item.imageUrl
          ? await imageUrlToDataUrl(item.imageUrl)
          : null;

        if (imageData) {
          try {
            doc.addImage(
              imageData,
              "JPEG",
              cardX + (cardWidth - imageSize) / 2,
              cardY + 5,
              imageSize,
              imageSize,
              undefined,
              "FAST"
            );
          } catch {
            try {
              doc.addImage(
                imageData,
                "PNG",
                cardX + (cardWidth - imageSize) / 2,
                cardY + 5,
                imageSize,
                imageSize,
                undefined,
                "FAST"
              );
            } catch {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(cardFont);
              doc.setTextColor(120, 120, 120);
              doc.text("No photo", cardX + cardWidth / 2 - 7, cardY + 20);
            }
          }
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(cardFont);
          doc.setTextColor(120, 120, 120);
          doc.text("No photo", cardX + cardWidth / 2 - 7, cardY + 20);
        }

        const textX = cardX + 5;
        let textY = cardY + 38;
        const maxTextWidth = cardWidth - 10;

        doc.setTextColor(17, 24, 39);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(titleFont);
        doc.text(
          inventoryCategory === GIVEAWAY_CATEGORY
            ? item.player_name || item.item_type || "Unnamed Player"
            : item.item_type || "Unnamed Item",
          textX,
          textY,
          { maxWidth: maxTextWidth }
        );

        doc.setFont("helvetica", "normal");
        doc.setFontSize(cardFont);
        textY += 3.4;

        if (inventoryCategory === GIVEAWAY_CATEGORY) {
          doc.text(
            `Qty: ${item.quantity ?? ""}   Jersey #: ${item.jersey_number || ""}   Color: ${item.color || ""}`,
            textX,
            textY,
            { maxWidth: maxTextWidth }
          );
          textY += 3.4;
          doc.text(`Last Year: ${item.last_year_worn || ""}`, textX, textY, {
            maxWidth: maxTextWidth,
          });
          textY += 3.4;
          doc.text(`Loc: ${item.storage_location || ""}`, textX, textY, {
            maxWidth: maxTextWidth,
          });
          textY += 3.4;
          doc.text(`Notes: ${item.notes || ""}`, textX, textY, {
            maxWidth: maxTextWidth,
          });
        } else {
          doc.text(
            `Qty: ${item.quantity ?? ""}   Size: ${item.size || ""}   Color: ${item.color || ""}`,
            textX,
            textY,
            { maxWidth: maxTextWidth }
          );
          textY += 3.4;
          doc.text(`Loc: ${item.storage_location || ""}`, textX, textY, {
            maxWidth: maxTextWidth,
          });
          textY += 3.4;
          doc.text(`Notes: ${item.notes || ""}`, textX, textY, {
            maxWidth: maxTextWidth,
          });
        }

        cardsOnCurrentPage += 1;
      }

      const safeName = exportTitle
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "");

      doc.save(`${safeName || "inventory-export"}.pdf`);
    } catch (err) {
      setError(err.message || "Unable to export PDF.");
    } finally {
      setExporting(false);
    }
  }

  const showCustomType =
    form.category === "Apparel" && form.item_type === "*Enter New Type";

  const currentStorageOptions = useMemo(() => {
    return sortUnique([
      ...(STORAGE_OPTIONS[form.category] || []),
      ...items
        .filter((item) => item.category === form.category)
        .map((item) => item.storage_location),
    ]);
  }, [form.category, items]);
  const showingInventoryHome = !inventoryCategory;
  const isGiveawayForm = form.category === GIVEAWAY_CATEGORY;
  const isGiveawayInventory = inventoryCategory === GIVEAWAY_CATEGORY;
  const nonApparelNonJersey =
    form.category !== "Apparel" && form.category !== GIVEAWAY_CATEGORY;

  return (
    <div style={styles.page}>
      <div style={styles.heroWrap}>
        <header style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.eyebrow}>Stanford Volleyball</div>
            <h1 style={styles.heroTitle}>Inventory Manager</h1>
            <p style={styles.heroText}>
              Keep track of Apparel, Camp, Giveaway Jerseys, Gym Equipment, Tech
              Equipment, & Travel/Recovery Equipment Inventory.
            </p>
          </div>
        </header>
      </div>

      <div style={styles.topTabs}>
        {APP_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => switchAppTab(tab)}
            style={{
              ...styles.topTab,
              ...(appTab === tab ? styles.topTabActive : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {appTab === "Inventory" ? (
        <section style={styles.panelWide}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Inventory</h2>
              <p style={styles.panelSubtext}>
                Choose a category, then a type to view full-width inventory
                cards.
              </p>
            </div>
          </div>

          <div style={styles.homeGrid}>
            {inventoryHomeCards.map((card) => {
              const isActive = inventoryCategory === card.title;

              return (
                <button
                  key={card.title}
                  type="button"
                  style={{
                    ...styles.homeButton,
                    ...(isActive ? styles.homeButtonActive : {}),
                  }}
                  onClick={() => {
                    setInventoryCategory(card.title);
                    if (card.title === GIVEAWAY_CATEGORY) {
                      setInventoryGroup(jerseyPlayerGroups[0] || "");
                    } else {
                      setInventoryGroup(INVENTORY_GROUPS[card.title][0]);
                    }
                  }}
                >
                  <IconBadge Icon={card.Icon} active={isActive} large />
                  <div style={styles.homeButtonText}>{card.title}</div>
                </button>
              );
            })}
          </div>

          {!showingInventoryHome && (
            <>
              <div style={styles.inventorySectionHeader}>
                <h3 style={styles.inventorySectionTitle}>
                  {inventoryCategory}
                </h3>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${inventoryCategory.toLowerCase()}...`}
                  style={styles.searchInput}
                />
              </div>

              {isGiveawayInventory && dynamicInventoryGroups.length === 0 ? (
                <div style={styles.emptyState}>
                  No jersey players added yet. Add a Giveaway Jerseys item with
                  a Player Name to create the first player button.
                </div>
              ) : (
                <div style={styles.itemTypeGrid}>
                  {dynamicInventoryGroups.map((type) => {
                    const isActive = inventoryGroup === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setInventoryGroup(type)}
                        style={{
                          ...styles.itemTypeButton,
                          ...(isActive ? styles.itemTypeButtonActive : {}),
                        }}
                      >
                        <div style={styles.itemTypeText}>{type}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {isGiveawayInventory ? (
                <div style={styles.filterGrid}>
                  <MultiSelectField
                    label="Player Name"
                    options={jerseyPlayerGroups}
                    selected={filters.playerNames}
                    allLabel="All Players"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, playerNames: values }))
                    }
                  />

                  <MultiSelectField
                    label="Player #"
                    options={availableJerseyNumberOptions}
                    selected={filters.jerseyNumbers}
                    allLabel="All Numbers"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, jerseyNumbers: values }))
                    }
                  />

                  <MultiSelectField
                    label="Color"
                    options={availableColorOptions}
                    selected={filters.colors}
                    allLabel="All Colors"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, colors: values }))
                    }
                  />

                  <MultiSelectField
                    label="Storage Location"
                    options={availableLocationOptions}
                    selected={filters.locations}
                    allLabel="All Locations"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, locations: values }))
                    }
                  />
                </div>
              ) : inventoryCategory === "Apparel" ? (
                <div style={styles.filterGrid}>
                  <MultiSelectField
                    label="Size Filter"
                    options={APPAREL_SIZES}
                    selected={filters.sizes}
                    allLabel="All Sizes"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, sizes: values }))
                    }
                  />

                  <MultiSelectField
                    label="Color Filter"
                    options={availableColorOptions}
                    selected={filters.colors}
                    allLabel="All Colors"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, colors: values }))
                    }
                  />

                  <MultiSelectField
                    label="Location Filter"
                    options={availableLocationOptions}
                    selected={filters.locations}
                    allLabel="All Locations"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, locations: values }))
                    }
                  />
                </div>
              ) : (
                <div style={styles.filterGrid}>
                  <Field label="Categories">
                    <select
                      value={inventoryGroup}
                      onChange={(e) => setInventoryGroup(e.target.value)}
                      style={styles.input}
                    >
                      {dynamicInventoryGroups.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <MultiSelectField
                    label="Location"
                    options={availableLocationOptions}
                    selected={filters.locations}
                    allLabel="All Locations"
                    onChange={(values) =>
                      setFilters((prev) => ({ ...prev, locations: values }))
                    }
                  />
                </div>
              )}

              <div style={styles.inventoryResultsHeader}>
                <div style={styles.inventoryResultsTitle}>
                  {isGiveawayInventory
                    ? inventoryGroup || "Giveaway Jerseys"
                    : inventoryGroup}
                </div>
                <div style={styles.inventoryResultsCount}>
                  {groupedInventoryItems.length} item(s)
                </div>
              </div>

              {loading ? (
                <p>Loading inventory...</p>
              ) : groupedInventoryItems.length === 0 ? (
                <div style={styles.emptyState}>
                  No items found in this section yet.
                </div>
              ) : (
                <div style={styles.fullWidthCardGrid}>
                  {groupedInventoryItems.map((item) => (
                    <article key={item.id} style={styles.fullWidthCard}>
                      <div style={styles.fullWidthCardImageWrap}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.item_type || item.category}
                            style={styles.fullWidthCardImage}
                          />
                        ) : (
                          <div style={styles.noPhoto}>No Photo</div>
                        )}
                      </div>

                      <div style={styles.fullWidthCardBody}>
                        <div style={styles.cardTopline}>
                          <span style={styles.tag}>{item.category}</span>
                          <span style={styles.qty}>Qty: {item.quantity}</span>
                        </div>

                        <h3 style={styles.cardTitle}>
                          {item.category === GIVEAWAY_CATEGORY
                            ? item.player_name ||
                              item.item_type ||
                              "Unnamed Player"
                            : item.item_type || "Unnamed Item"}
                        </h3>

                        {editingItemId === item.id ? (
                          <div style={styles.inlineEditGrid}>
                            <Field label="Quantity">
                              <input
                                type="number"
                                min="0"
                                value={editDraft.quantity}
                                onChange={(e) =>
                                  setEditDraft((prev) => ({
                                    ...prev,
                                    quantity: e.target.value,
                                  }))
                                }
                                style={styles.input}
                              />
                            </Field>

                            <Field label="Storage Location">
                              <select
                                value={editDraft.storage_location}
                                onChange={(e) =>
                                  setEditDraft((prev) => ({
                                    ...prev,
                                    storage_location: e.target.value,
                                  }))
                                }
                                style={styles.input}
                              >
                                {(STORAGE_OPTIONS[item.category] || []).map(
                                  (option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  )
                                )}
                              </select>
                            </Field>

                            <Field label="Notes">
                              <textarea
                                value={editDraft.notes}
                                onChange={(e) =>
                                  setEditDraft((prev) => ({
                                    ...prev,
                                    notes: e.target.value,
                                  }))
                                }
                                rows={4}
                                style={{
                                  ...styles.input,
                                  resize: "vertical",
                                  minHeight: 110,
                                }}
                              />
                            </Field>

                            <div style={styles.cardActions}>
                              <button
                                type="button"
                                style={styles.primaryButton}
                                onClick={() => saveInlineEdit(item)}
                              >
                                Save Changes
                              </button>
                              <button
                                type="button"
                                style={styles.secondaryButton}
                                onClick={() => setEditingItemId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={styles.metaGrid}>
                              {item.category === GIVEAWAY_CATEGORY ? (
                                <>
                                  {item.jersey_number ? (
                                    <div>
                                      <strong>Jersey #:</strong>{" "}
                                      {item.jersey_number}
                                    </div>
                                  ) : null}
                                  {item.color ? (
                                    <div>
                                      <strong>Color:</strong> {item.color}
                                    </div>
                                  ) : null}
                                  {item.last_year_worn ? (
                                    <div>
                                      <strong>Last Year Worn:</strong>{" "}
                                      {item.last_year_worn}
                                    </div>
                                  ) : null}
                                  <div>
                                    <strong>Location:</strong>{" "}
                                    {item.storage_location}
                                  </div>
                                </>
                              ) : (
                                <>
                                  {item.color ? (
                                    <div>
                                      <strong>Color:</strong> {item.color}
                                    </div>
                                  ) : null}
                                  {item.size ? (
                                    <div>
                                      <strong>Size:</strong> {item.size}
                                    </div>
                                  ) : null}
                                  {item.year ? (
                                    <div>
                                      <strong>Year:</strong> {item.year}
                                    </div>
                                  ) : null}
                                  {item.year_received ? (
                                    <div>
                                      <strong>Year Received:</strong>{" "}
                                      {item.year_received}
                                    </div>
                                  ) : null}
                                  {item.expected_lifespan ? (
                                    <div>
                                      <strong>Expected Lifespan:</strong>{" "}
                                      {item.expected_lifespan}
                                    </div>
                                  ) : null}
                                  <div>
                                    <strong>Location:</strong>{" "}
                                    {item.storage_location}
                                  </div>
                                </>
                              )}
                            </div>

                            {item.notes ? (
                              <div style={styles.notesBox}>
                                <strong>Notes:</strong> {item.notes}
                              </div>
                            ) : null}

                            <div style={styles.cardActions}>
                              <button
                                type="button"
                                style={styles.secondaryButton}
                                onClick={() => startInlineEdit(item)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                style={styles.secondaryButton}
                                onClick={() => duplicateItem(item)}
                              >
                                Duplicate
                              </button>
                              <button
                                type="button"
                                style={styles.deleteButton}
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div style={styles.exportPanel}>
                <div style={styles.exportHeader}>
                  <div style={styles.exportTitleWrap}>
                    <FileDown
                      size={20}
                      strokeWidth={2.3}
                      style={{ color: STANFORD_CARDINAL }}
                    />
                    <div>
                      <div style={styles.exportTitle}>Export PDF</div>
                      <div style={styles.exportHelp}>
                        Create a PDF from the selected filters, category,
                        player, type, or storage location.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    style={styles.primaryButton}
                    onClick={exportPdf}
                    disabled={exporting}
                  >
                    {exporting ? "Exporting..." : "Export PDF"}
                  </button>
                </div>

                <div style={styles.exportControlsGrid}>
                  <Field label="Export Option">
                    <select
                      value={exportState.mode}
                      onChange={(e) =>
                        updateExportState("mode", e.target.value)
                      }
                      style={styles.input}
                    >
                      {activeExportModes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {(exportState.mode === "size_type" ||
                    exportState.mode === "type") && (
                    <Field
                      label={
                        inventoryCategory === "Apparel"
                          ? "Item Type"
                          : "Category"
                      }
                    >
                      <select
                        value={exportState.itemType}
                        onChange={(e) =>
                          updateExportState("itemType", e.target.value)
                        }
                        style={styles.input}
                      >
                        {dynamicInventoryGroups.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  {exportState.mode === "size_type" &&
                    inventoryCategory === "Apparel" && (
                      <Field label="Size">
                        <select
                          value={exportState.size}
                          onChange={(e) =>
                            updateExportState("size", e.target.value)
                          }
                          style={styles.input}
                        >
                          {APPAREL_SIZES.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}

                  {exportState.mode === "player" && (
                    <Field label="Player Name">
                      <select
                        value={exportState.playerName}
                        onChange={(e) =>
                          updateExportState("playerName", e.target.value)
                        }
                        style={styles.input}
                      >
                        {jerseyPlayerGroups.map((player) => (
                          <option key={player} value={player}>
                            {player}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  {exportState.mode === "jersey_number" && (
                    <Field label="Jersey #">
                      <select
                        value={exportState.jerseyNumber}
                        onChange={(e) =>
                          updateExportState("jerseyNumber", e.target.value)
                        }
                        style={styles.input}
                      >
                        {availableJerseyNumberOptions.map((number) => (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  {exportState.mode === "color" && (
                    <Field label="Color">
                      <select
                        value={exportState.color}
                        onChange={(e) =>
                          updateExportState("color", e.target.value)
                        }
                        style={styles.input}
                      >
                        {availableColorOptions.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  {exportState.mode === "storage" && (
                    <Field label="Storage Location">
                      <select
                        value={exportState.storageLocation}
                        onChange={(e) =>
                          updateExportState("storageLocation", e.target.value)
                        }
                        style={styles.input}
                      >
                        {availableLocationOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>

                <div style={styles.exportSummaryRow}>
                  <div style={styles.exportSummaryChip}>
                    <PackageSearch size={16} strokeWidth={2.3} />
                    {itemsForExport.length} item(s) selected
                  </div>
                  <div style={styles.exportSummaryChip}>
                    <Boxes size={16} strokeWidth={2.3} />
                    {exportTitle}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      ) : (
        <section style={styles.panelWide}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>
                {form.id ? "Edit Item" : "Add Item"}
              </h2>
              <p style={styles.panelSubtext}>
                Upload the photo first, then complete the details and save.
              </p>
            </div>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => resetForm(form.category)}
            >
              New
            </button>
          </div>

          <div style={styles.addCategoryRow}>
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              const isActive = form.category === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  style={{
                    ...styles.addCategoryButton,
                    ...(isActive ? styles.addCategoryButtonActive : {}),
                  }}
                >
                  <IconBadge Icon={Icon} active={isActive} large />
                  <span style={styles.addCategoryText}>{category}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            {true && (
              <>
                <Field label="Photo">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={styles.input}
                  />
                </Field>

                {form.imageUrl ? (
                  <div style={styles.previewWrapLarge}>
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      style={styles.previewImageLarge}
                    />
                  </div>
                ) : (
                  <div style={styles.photoPlaceholder}>Upload item photo</div>
                )}
              </>
            )}

            <div style={styles.formColumnSecondary}>
              {isGiveawayForm ? (
                <>
                  <Field label="Player Name">
                    <input
                      name="player_name"
                      value={form.player_name}
                      onChange={handleInputChange}
                      placeholder="Example: Logan Tom"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Jersey #">
                    <input
                      name="jersey_number"
                      value={form.jersey_number}
                      onChange={handleInputChange}
                      placeholder="Example: 12"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Color">
                    <select
                      name="color"
                      value={form.color}
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      <option value="">Select Color</option>
                      {COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Last Year Worn">
                    <input
                      type="number"
                      name="last_year_worn"
                      value={form.last_year_worn}
                      onChange={handleInputChange}
                      placeholder="Example: 2024"
                      style={styles.input}
                    />
                  </Field>
                </>
              ) : form.category === "Apparel" ? (
                <>
                  <Field label="Item Type">
                    <select
                      name="item_type"
                      value={form.item_type}
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      {APPAREL_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {showCustomType && (
                    <Field label="New Type Name">
                      <input
                        name="custom_type"
                        value={form.custom_type}
                        onChange={handleInputChange}
                        placeholder="Enter new apparel type"
                        style={styles.input}
                      />
                    </Field>
                  )}

                  <Field label="Color">
                    <select
                      name="color"
                      value={form.color}
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      <option value="">Select Color</option>
                      {COLOR_OPTIONS.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Size">
                    <select
                      name="size"
                      value={form.size}
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      {APPAREL_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Year">
                    <input
                      type="number"
                      name="year"
                      value={form.year}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Item Name">
                    <select
                      name="item_type"
                      value={form.item_type}
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      {INVENTORY_GROUPS[form.category].map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Size">
                    <input
                      name="size"
                      value={form.size}
                      onChange={handleInputChange}
                      placeholder="Example: Large, 55-inch, Standard"
                      style={styles.input}
                    />
                  </Field>

                  <Field label="Year Received">
                    <input
                      type="number"
                      name="year_received"
                      value={form.year_received}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </Field>

                  {nonApparelNonJersey && form.category !== "Camp" && (
                    <Field label="Expected Lifespan">
                      <input
                        name="expected_lifespan"
                        value={form.expected_lifespan}
                        onChange={handleInputChange}
                        placeholder="Example: 5 years"
                        style={styles.input}
                      />
                    </Field>
                  )}
                </>
              )}

              <Field label="Quantity">
                <input
                  type="number"
                  min="0"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </Field>

              <Field label="Storage Location">
                <select
                  name="storage_location"
                  value={form.storage_location}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  {currentStorageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value={ADD_NEW_LOCATION_VALUE}>+ Add New Location</option>
                </select>
              </Field>

              {form.storage_location === ADD_NEW_LOCATION_VALUE && (
                <Field label="New Storage Location">
                  <input
                    name="custom_storage_location"
                    value={form.custom_storage_location}
                    onChange={handleInputChange}
                    placeholder="Example: Locker Room Closet - Bin 5"
                    style={styles.input}
                  />
                </Field>
              )}

              <Field label="Notes">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Optional notes"
                  style={{
                    ...styles.input,
                    resize: "vertical",
                    minHeight: 130,
                  }}
                />
              </Field>

              <button
                type="submit"
                style={styles.primaryButton}
                disabled={saving}
              >
                {saving ? "Saving..." : form.id ? "Update Item" : "Save Item"}
              </button>

              {error ? <div style={styles.error}>{error}</div> : null}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f5f1e8 0%, #fdfcf8 100%)",
    padding: "clamp(10px, 2vw, 18px)",
    fontFamily:
      'Avenir Next, Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#1f2937",
  },
  heroWrap: {
    maxWidth: 1360,
    margin: "0 auto 18px auto",
  },
  hero: {
    background:
      "linear-gradient(135deg, #8c1515 0%, #7b1113 45%, #5f0f13 100%)",
    color: "white",
    borderRadius: "clamp(22px, 4vw, 34px)",
    padding: "clamp(22px, 5vw, 44px)",
    boxShadow: "0 18px 38px rgba(73, 34, 34, 0.16)",
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 20,
    alignItems: "start",
  },
  heroContent: {
    minWidth: 0,
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 10,
    opacity: 0.98,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(38px, 7vw, 56px)",
    lineHeight: 0.96,
    fontWeight: 800,
    textShadow: "0 3px 0 rgba(0,0,0,0.08), 0 10px 22px rgba(0,0,0,0.18)",
  },
  heroText: {
    marginTop: 18,
    maxWidth: 900,
    lineHeight: 1.45,
    fontSize: 18,
    opacity: 0.98,
  },
  topTabs: {
    maxWidth: 1360,
    margin: "0 auto 18px auto",
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  topTab: {
    border: "1px solid #d7cfc1",
    background: "#ffffff",
    color: "#3b2f2f",
    borderRadius: 999,
    padding: "12px 20px",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    WebkitTapHighlightColor: "transparent",
  },
  topTabActive: {
    background: STANFORD_CARDINAL,
    color: "#ffffff",
    borderColor: STANFORD_CARDINAL,
  },
  panelWide: {
    maxWidth: 1360,
    margin: "0 auto",
    background: "rgba(255,255,255,0.96)",
    borderRadius: "clamp(22px, 4vw, 34px)",
    boxShadow: "0 18px 38px rgba(73, 34, 34, 0.10)",
    padding: "clamp(18px, 3vw, 28px)",
    backdropFilter: "blur(10px)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  panelTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    color: "#20293b",
  },
  panelSubtext: {
    margin: "6px 0 0 0",
    color: "#6b7280",
    fontSize: 15,
  },
  homeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
    marginBottom: 24,
  },
  homeButton: {
    border: "2px solid #111111",
    background: "#ffffff",
    borderRadius: 30,
    minHeight: 132,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    fontWeight: 900,
    fontSize: 18,
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
    WebkitTapHighlightColor: "transparent",
  },
  homeButtonActive: {
    background: STANFORD_CARDINAL,
    color: "white",
    borderColor: STANFORD_CARDINAL,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 900,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    background: "#f2ecec",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
  },
  iconBadgeLarge: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  iconBadgeActive: {
    background: "rgba(255,255,255,0.16)",
  },
  inventorySectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  inventorySectionTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    color: "#20293b",
  },
  searchInput: {
    width: 320,
    maxWidth: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid #d7d2c7",
    fontSize: 15,
    boxSizing: "border-box",
  },
  itemTypeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))",
    gap: 10,
    marginBottom: 18,
  },
  itemTypeButton: {
    border: "1px solid #d9d0c5",
    background: "#fffdfa",
    borderRadius: 18,
    minHeight: 76,
    padding: "10px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.035)",
    WebkitTapHighlightColor: "transparent",
  },
  itemTypeButtonActive: {
    background: STANFORD_CARDINAL,
    color: "white",
    borderColor: STANFORD_CARDINAL,
  },
  itemTypeText: {
    fontSize: 14,
    fontWeight: 800,
    textAlign: "center",
    lineHeight: 1.25,
  },
  filterGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    gap: "18px 24px",
    marginBottom: 18,
  },
  filterField: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: 6,
    width: "auto",
    minWidth: 220,
    maxWidth: 460,
    flex: "0 1 420px",
    alignSelf: "flex-start",
    margin: 0,
    padding: 0,
  },
  filterLabel: {
    display: "block",
    fontWeight: 800,
    color: "#4b5563",
    fontSize: 13,
    letterSpacing: "0.01em",
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
  },
  multiSelectGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    gap: 8,
    width: "100%",
    margin: 0,
    padding: 0,
  },
  filterChip: {
    border: "1px solid #d9d0c5",
    background: "#fffdfa",
    borderRadius: 12,
    width: 126,
    height: 40,
    minHeight: 40,
    padding: "0 10px",
    fontSize: 11,
    fontWeight: 800,
    cursor: "pointer",
    color: "#374151",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    lineHeight: 1.08,
    whiteSpace: "normal",
    wordBreak: "normal",
    overflowWrap: "break-word",
    boxSizing: "border-box",
    margin: 0,
    WebkitTapHighlightColor: "transparent",
  },
  filterChipActive: {
    background: STANFORD_CARDINAL,
    color: "#ffffff",
    borderColor: STANFORD_CARDINAL,
  },
  inventoryResultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  inventoryResultsTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: "#111827",
  },
  inventoryResultsCount: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 700,
  },
  emptyState: {
    padding: 28,
    borderRadius: 22,
    background: "#f9f7f2",
    border: "1px solid #e8e0d3",
    color: "#6b7280",
    fontWeight: 700,
  },
  fullWidthCardGrid: {
    display: "grid",
    gap: 18,
  },
  fullWidthCard: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    background: "#fffdfa",
    borderRadius: 28,
    overflow: "hidden",
    border: "1px solid #ece4d8",
    boxShadow: "0 12px 28px rgba(0,0,0,0.06)",
  },
  fullWidthCardImageWrap: {
    minHeight: 290,
    background: "#f1ece2",
  },
  fullWidthCardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  fullWidthCardBody: {
    padding: 22,
    display: "grid",
    alignContent: "start",
    gap: 14,
  },
  inlineEditGrid: {
    display: "grid",
    gap: 14,
  },
  cardTopline: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  tag: {
    background: "rgba(140,21,21,0.10)",
    color: STANFORD_CARDINAL,
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 13,
    fontWeight: 800,
  },
  qty: {
    color: "#4b5563",
    fontSize: 14,
    fontWeight: 800,
  },
  cardTitle: {
    margin: 0,
    fontSize: 30,
    fontWeight: 900,
    color: "#111827",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(180px, 1fr))",
    gap: 10,
    color: "#374151",
    lineHeight: 1.4,
  },
  notesBox: {
    background: "#f8f5ef",
    borderRadius: 18,
    padding: 14,
    border: "1px solid #e9dfd0",
    color: "#374151",
  },
  cardActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  exportPanel: {
    border: "1px solid #e6ddd0",
    background: "#fbf8f2",
    borderRadius: 24,
    padding: 18,
    marginTop: 28,
    marginBottom: 22,
  },
  exportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  exportTitleWrap: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: "#20293b",
  },
  exportHelp: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 3,
  },
  exportControlsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 14,
  },
  exportSummaryRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  exportSummaryChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    border: "1px solid #e3d7c5",
    background: "#fffdfa",
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 700,
    color: "#4b5563",
  },
  addCategoryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
    marginBottom: 28,
  },
  addCategoryButton: {
    border: "2px solid #111111",
    background: "#ffffff",
    borderRadius: 30,
    minHeight: 132,
    cursor: "pointer",
    fontWeight: 900,
    fontSize: "clamp(15px, 2vw, 18px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    textAlign: "center",
    padding: "16px 12px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    WebkitTapHighlightColor: "transparent",
  },
  addCategoryButtonActive: {
    background: STANFORD_CARDINAL,
    color: "white",
    borderColor: STANFORD_CARDINAL,
  },
  addCategoryText: {
    display: "block",
    lineHeight: 1.15,
    fontSize: 18,
    fontWeight: 900,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 18,
    background: "#fffdfa",
    border: "1px solid #ebe3d8",
    borderRadius: 28,
    padding: "clamp(16px, 3vw, 24px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  },
  formColumnSecondary: {
    display: "grid",
    gap: 16,
  },
  field: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontWeight: 800,
    color: "#4b5563",
    fontSize: 13,
    letterSpacing: "0.01em",
    marginBottom: 2,
    lineHeight: 1.1,
  },
  input: {
    width: "100%",
    minHeight: 52,
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid #c9c9d2",
    background: "#ffffff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none",
  },
  previewWrapLarge: {
    borderRadius: 24,
    overflow: "hidden",
    border: "1px solid #ddd6c8",
    background: "#f2eee5",
    minHeight: 260,
  },
  previewImageLarge: {
    display: "block",
    width: "100%",
    height: "clamp(240px, 45vw, 340px)",
    objectFit: "cover",
  },
  photoPlaceholder: {
    minHeight: "clamp(220px, 44vw, 320px)",
    borderRadius: 24,
    border: "1px dashed #cabfae",
    background: "#faf7f0",
    color: "#7c7c7c",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  primaryButton: {
    border: "none",
    borderRadius: 18,
    padding: "16px 18px",
    background: STANFORD_CARDINAL,
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    boxShadow: "0 12px 24px rgba(140,21,21,0.24)",
    WebkitTapHighlightColor: "transparent",
  },
  secondaryButton: {
    border: "none",
    borderRadius: 18,
    padding: "14px 18px",
    background: "#e6dfd3",
    color: "#222",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    WebkitTapHighlightColor: "transparent",
  },
  deleteButton: {
    border: "none",
    borderRadius: 18,
    padding: "14px 18px",
    background: "#20293b",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    WebkitTapHighlightColor: "transparent",
  },
  error: {
    color: "#b91c1c",
    fontWeight: 800,
    marginTop: 4,
  },
  noPhoto: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    color: "#777",
    fontWeight: 700,
  },
};
