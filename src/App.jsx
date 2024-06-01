import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function FetchComponent() {
  const [searchItem, setSearchItem] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Ensure Bootstrap's JS is included
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearchInput = (event) => {
    setSearchItem(event.target.value);
  };

  const searchFood = (event) => {
    if (event.key === 'Enter') {
      setLoading(true);
      const options = {
        method: 'GET',
      };
      const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchItem}&app_id=6a3d8b20&app_key=69885de925b1b76cd071c50eebb9cdb5`;
      fetch(url, options)
        .then((response) => response.json())
        .then((jsonData) => {
          console.log(jsonData);
          setSearchResults(jsonData.hits);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setError(error);
          setLoading(false);
        });
    }
  };

  const handleCardClick = (index) => {
    setSelectedRecipe(searchResults[index].recipe);
    // Trigger the modal manually
    if (window.bootstrap) {
      const myModal = new window.bootstrap.Modal(document.getElementById('recipeModal'), {});
      myModal.show();
    }
  };

  return (
    <div className="main-container">
      <div className="food-search-header text-center">
        <img
          className="food-logo d-none d-sm-block"
          src="https://i.pinimg.com/originals/32/44/54/3244546413efce41965cbfe4e04b7ba5.jpg"
          alt="Wiki Logo"
        />
        <br />
        <input
          placeholder="Search food item..."
          type="search"
          className="search-input w-100 d-none d-sm-block"
          id="searchInput"
          value={searchItem}
          onChange={handleSearchInput}
          onKeyDown={searchFood}
        />
      </div>
      <div className="food-search-header d-flex flex-row">
        <img
          className="food-logo d-block d-sm-none"
          src="https://i.pinimg.com/originals/32/44/54/3244546413efce41965cbfe4e04b7ba5.jpg"
          alt="Wiki Logo"
        />
       
        <input
          placeholder="Search food item..."
          type="search"
          className="search-input w-100 d-sm-none"
          id="searchInput"
          value={searchItem}
          onChange={handleSearchInput}
          onKeyDown={searchFood}
        />
      </div>
      {loading && (
        <div className="d-flex justify-content-center" id="spinner">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-12">
          <div
            id="searchResults"
            className="container-bg d-flex flex-wrap justify-content-center"
          >
            {searchResults.map((hit, index) => (
              <div
                key={index}
                className={`card-style shadow ${hit.active ? 'active' : ''}`}
                onClick={() => handleCardClick(index)}
              >
                <img src={hit.recipe.image} alt={hit.recipe.label} className="img" />
                <p className="col-12 link-description 
                text-center">{hit.recipe.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {error && <div>Error: {error.message}</div>}

      {/* Modal */}
      <div className="modal fade" id="recipeModal" tabIndex="-1" aria-labelledby="recipeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title ingredents_style" id="recipeModalLabel">{selectedRecipe?.label}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body no-scrollbar">
              <img src={selectedRecipe?.image} alt={selectedRecipe?.label} className="img-fluid" />
              <h6 className='ingredents_style'>Ingredients:</h6>
              <ul>
                {selectedRecipe?.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient.text}</li>
                ))}
              </ul>
              <h6 className='ingredents_style'>Diet Labels:</h6>
              <p className='pt-2'>{selectedRecipe?.dietLabels.join(', ')}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FetchComponent;