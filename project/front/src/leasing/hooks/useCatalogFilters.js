import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { apiClient } from "../../common/utils/apiClient";

const getDateInFrance = (daysFromToday = 0) => {
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0];
};

const getMinimumRentalStartDateFrance = () => getDateInFrance(0);

const hasActiveFilters = ({ city, startDate, endDate }) =>
  !!city || !!startDate || !!endDate;

const getFilterValidationError = (
  { city, startDate, endDate },
  minStartDate,
) => {
  const hasCity = !!city;
  const hasStartDate = !!startDate;
  const hasEndDate = !!endDate;

  if (!hasCity && !hasStartDate && !hasEndDate) return "";

  if (hasStartDate !== hasEndDate) {
    return "Renseignez une date de début et une date de fin.";
  }

  if (
    (startDate && startDate < minStartDate) ||
    (endDate && endDate < minStartDate)
  ) {
    return "La date de début doit être à partir d'aujourd'hui.";
  }

  if (startDate && endDate && endDate < startDate) {
    return "La date de fin doit être après la date de début.";
  }

  return "";
};

const getFiltersFromSearchParams = (searchParams) => ({
  city: searchParams.get("city") || "",
  startDate: searchParams.get("startDate") || "",
  endDate: searchParams.get("endDate") || "",
});

const buildSearchParamsFromFilters = ({ city, startDate, endDate }) => {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  return params;
};

const buildFilterBody = ({ city, startDate, endDate }) => {
  const body = {};
  if (city) body.city = city;
  if (startDate) body.startDate = startDate;
  if (endDate) body.endDate = endDate;
  return body;
};

export default function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilters = getFiltersFromSearchParams(searchParams);
  const minRentalStartDate = getMinimumRentalStartDateFrance();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(initialFilters.city);
  const [startDate, setStartDate] = useState(initialFilters.startDate);
  const [endDate, setEndDate] = useState(initialFilters.endDate);
  const [dateError, setDateError] = useState("");
  const [showNoResultModal, setShowNoResultModal] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    setError("");
    setShowNoResultModal(false);
    apiClient
      .get("/public/leasing/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Impossible de charger les articles."))
      .finally(() => setLoading(false));
  };

  const loadFilteredProducts = (filters) => {
    setLoading(true);
    setError("");
    setShowNoResultModal(false);

    apiClient
      .post("/public/leasing/products/filter", buildFilterBody(filters))
      .then((res) => {
        setProducts(res.data);
        if (res.data.length === 0) setShowNoResultModal(true);
      })
      .catch(() => setError("Erreur lors du filtrage."))
      .finally(() => setLoading(false));
  };

  const loadProductsFromFilters = (filters) => {
    const validationError = getFilterValidationError(
      filters,
      minRentalStartDate,
    );

    if (validationError) {
      setDateError(validationError);
      setError("");
      setProducts([]);
      setShowNoResultModal(false);
      setLoading(false);
      return;
    }

    setDateError("");

    if (!hasActiveFilters(filters)) {
      loadProducts();
      return;
    }

    loadFilteredProducts(filters);
  };

  useEffect(() => {
    const filters = getFiltersFromSearchParams(searchParams);
    /* eslint-disable react-hooks/set-state-in-effect -- Synchronise les champs quand l'URL change via retour navigateur. */
    setCity(filters.city);
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
    /* eslint-enable react-hooks/set-state-in-effect */
    loadProductsFromFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    apiClient
      .get("/public/leasing/products/cities")
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, []);

  const handleSearch = () => {
    const filters = { city, startDate, endDate };
    const validationError = getFilterValidationError(
      filters,
      minRentalStartDate,
    );

    if (validationError) {
      setDateError(validationError);
      return false;
    }

    setDateError("");
    setShowNoResultModal(false);

    const nextSearchParams = buildSearchParamsFromFilters(filters);
    if (nextSearchParams.toString() === searchParams.toString()) {
      loadProductsFromFilters(filters);
      return true;
    }

    setSearchParams(nextSearchParams);
    return true;
  };

  const handleResetFilters = () => {
    setCity("");
    setStartDate("");
    setEndDate("");
    setDateError("");
    setShowNoResultModal(false);

    if (!searchParams.toString()) {
      loadProducts();
      return;
    }

    setSearchParams(new URLSearchParams());
  };

  return {
    products,
    loading,
    error,
    cities,
    city,
    setCity,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dateError,
    showNoResultModal,
    setShowNoResultModal,
    minRentalStartDate,
    handleSearch,
    handleResetFilters,
  };
}
