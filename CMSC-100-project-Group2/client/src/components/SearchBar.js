import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ onSearch, searchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:3001/get-all-users");
      const { users } = response.data;

      const filteredUsers = users.filter(
        (user) =>
          (user.userType === "Adviser" || user.userType === "Clearance Officer") &&
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort the filtered users alphabetically
      const sortedUsers = sortAscending
        ? filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName))
        : filteredUsers.sort((a, b) => b.firstName.localeCompare(a.firstName));

      onSearch(sortedUsers);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const handleSort = () => {
    setSortAscending(!sortAscending);
    handleSearch();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleSort}>
          {sortAscending ? "Sort A-Z" : "Sort Z-A"}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
