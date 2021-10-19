import { useState, useCallback, useEffect } from 'react';

const useSearchMessage = (messages) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchMessages = useCallback(() => {
    const regex = new RegExp(searchTerm, 'gi');

    const searchResults = messages.reduce((acc, message) => {
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }

      return acc;
    }, []);

    setSearchResults(searchResults);
    setSearchLoading(false);
  }, [messages, searchTerm]);

  const handleSearchChange = (evt) => {
    setSearchTerm(evt.target.value);
    setSearchLoading(true);
  };

  useEffect(() => {
    handleSearchMessages();
  }, [handleSearchMessages]);

  return {
    searchTerm,
    searchLoading,
    searchResults,
    handleSearchChange
  }
};

export default useSearchMessage;